import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AudioModule, setAudioModeAsync, useAudioRecorder } from 'expo-audio';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { cardShadow, type } from '@/constants/colors';
import { CADENCE_RECORDING } from '@/constants/recording';
import { useSession } from '@/contexts/SessionContext';
import RecordButton from '@/components/RecordButton';
import WaveformVisualizer from '@/components/WaveformVisualizer';
import { analyzeRecording } from '@/services/api';
import { Session } from '@/types';
import { Sparkle, Blob1 } from '@/components/Illustrations';

type ScreenStatus = 'idle' | 'recording' | 'processing' | 'denied' | 'error';
const RECORD_SECONDS = 60;

/** Rotating explanation lines shown during the very first analysis. */
const FIRST_RUN_LINES = [
  'We look at the words you chose — and where a sharper one was available.',
  '"Where your point landed" means which sentence carried your main idea, and how long we waited for it.',
  'Filler count is the least interesting part. Word choice and structure change how you sound; "um" mostly doesn\'t.',
];

export default function RecordingScreen() {
  const { prompt, onboarding, mockDenied } = useLocalSearchParams<{
    prompt: string;
    onboarding?: string;
    mockDenied?: string;
  }>();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { addSession, sessions } = useSession();

  const isFirstRun = onboarding === '1' && sessions.length === 0;

  const [status, setStatus] = useState<ScreenStatus>(mockDenied === '1' ? 'denied' : 'idle');
  const [timeLeft, setTimeLeft] = useState(RECORD_SECONDS);
  const [errorMsg, setErrorMsg] = useState('');
  const [lineIdx, setLineIdx] = useState(0);

  const recorder = useAudioRecorder(CADENCE_RECORDING);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lineTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeLeftRef = useRef(RECORD_SECONDS);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
      if (lineTimerRef.current) clearInterval(lineTimerRef.current);
      // The recorder instance itself is released automatically by useAudioRecorder.
    };
  }, [cleanup]);

  // Rotate the first-run explanation lines while processing.
  useEffect(() => {
    if (status === 'processing' && isFirstRun) {
      lineTimerRef.current = setInterval(() => {
        setLineIdx(i => (i + 1) % FIRST_RUN_LINES.length);
      }, 3200);
      return () => {
        if (lineTimerRef.current) clearInterval(lineTimerRef.current);
      };
    }
  }, [status, isFirstRun]);

  const finishRecording = useCallback(
    async (elapsedSeconds: number) => {
      cleanup();
      setStatus('processing');
      try {
        await recorder.stop();
        if (Platform.OS !== 'web') {
          await setAudioModeAsync({ allowsRecording: false });
        }
        const uri = recorder.uri;
        if (!uri) throw new Error('No audio was captured');

        // PRD F3: log what we ACTUALLY got. Platforms silently ignore audio
        // constraints they cannot honour, so the format we asked for is not
        // evidence of the format we received. A .wav here means iOS gave us
        // uncompressed PCM; anything else means it fell back and the
        // acoustic metrics for this session are degraded.
        console.log('[recording] captured', {
          uri: uri.split('/').pop(),
          requested: `${CADENCE_RECORDING.extension} ${CADENCE_RECORDING.sampleRate}Hz ` +
            `${CADENCE_RECORDING.numberOfChannels}ch`,
          platform: Platform.OS,
          elapsedSeconds,
        });

        const result = await analyzeRecording(uri, prompt ?? '', elapsedSeconds);

        const session: Session = {
          id: `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
          date: new Date().toISOString(),
          prompt: prompt ?? '',
          audioUri: uri,
          transcript: result.transcript,
          analysis: result.analysis,
          duration: elapsedSeconds,
        };
        await addSession(session);
        router.replace({
          pathname: '/results/[id]',
          params: onboarding === '1' ? { id: session.id, onboarding: '1' } : { id: session.id },
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
        setErrorMsg(msg);
        setStatus('error');
      }
    },
    [cleanup, prompt, addSession, recorder, onboarding],
  );

  const startRecording = useCallback(async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not supported', 'Please use the Expo Go app on your phone to record.');
      return;
    }
    try {
      const { status: permStatus } = await AudioModule.requestRecordingPermissionsAsync();
      if (permStatus !== 'granted') {
        setStatus('denied');
        return;
      }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      timeLeftRef.current = RECORD_SECONDS;
      setTimeLeft(RECORD_SECONDS);
      setStatus('recording');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      timerRef.current = setInterval(() => {
        timeLeftRef.current -= 1;
        setTimeLeft(timeLeftRef.current);
        if (timeLeftRef.current <= 0) {
          cleanup();
          finishRecording(RECORD_SECONDS);
        }
      }, 1000);
    } catch {
      setStatus('error');
      setErrorMsg('Could not start recording. Check microphone access and try again.');
    }
  }, [cleanup, finishRecording, recorder]);

  const handleStopEarly = useCallback(async () => {
    if (status !== 'recording') return;
    const elapsed = RECORD_SECONDS - timeLeftRef.current;
    if (elapsed < 5) {
      Alert.alert('Keep going', 'Record for at least 5 seconds before stopping.');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    finishRecording(elapsed);
  }, [status, finishRecording]);

  const handleClose = useCallback(() => {
    if (status === 'recording') {
      Alert.alert('Discard recording?', 'Your practice session will not be saved.', [
        { text: 'Keep going', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: async () => {
            cleanup();
            try { await recorder.stop(); } catch { /* ignore */ }
            router.back();
          },
        },
      ]);
    } else {
      router.back();
    }
  }, [status, cleanup, recorder]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (status === 'processing') {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.centeredContent}>
          <Sparkle color={colors.yellow} size={64} style={{ marginBottom: 16 }} />
          {isFirstRun ? (
            <Text style={[styles.firstRunLine, { color: colors.foreground, fontFamily: type.body }]}>
              {FIRST_RUN_LINES[lineIdx]}
            </Text>
          ) : (
            <>
              <Text style={[styles.processingTitle, { color: colors.foreground, fontFamily: type.semibold }]}>
                Analyzing your speech
              </Text>
              <Text style={[styles.processingHint, { color: colors.mutedForeground, fontFamily: type.body }]}>
                Vocabulary, structure, articulation
              </Text>
            </>
          )}
        </View>
      </View>
    );
  }

  if (status === 'denied') {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.centeredContent}>
          <Feather name="mic-off" size={48} color={colors.mutedForeground} />
          <Text style={[styles.processingTitle, { color: colors.foreground, fontFamily: type.semibold, marginTop: 24 }]}>
            Microphone access is off
          </Text>
          <Text style={[styles.errorMsg, { color: colors.mutedForeground, fontFamily: type.body }]}>
            Cadence needs the microphone to hear your sixty seconds. Nothing is recorded until you tap the button.
            {'\n\n'}Turn it on in Settings → Cadence → Microphone, then come back.
          </Text>
          <Pressable
            onPress={() => Linking.openSettings().catch(() => {})}
            style={({ pressed }) => [styles.retryBtn, cardShadow, { backgroundColor: colors.primary, borderRadius: 36, opacity: pressed ? 0.85 : 1 }]}
          >
            <Text style={[styles.retryText, { color: colors.primaryForeground, fontFamily: type.semibold }]}>Open settings</Text>
          </Pressable>
          <Pressable onPress={() => router.back()} style={styles.dismissBtn}>
            <Text style={[styles.dismissText, { color: colors.mutedForeground, fontFamily: type.body }]}>Not now</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.centeredContent}>
          <Feather name="alert-circle" size={48} color={colors.destructive} />
          <Text style={[styles.processingTitle, { color: colors.foreground, fontFamily: type.semibold, marginTop: 24 }]}>
            Something went wrong
          </Text>
          <Text style={[styles.errorMsg, { color: colors.mutedForeground, fontFamily: type.body }]}>
            {errorMsg}
          </Text>
          <Pressable
            onPress={() => { setStatus('idle'); setTimeLeft(RECORD_SECONDS); }}
            style={({ pressed }) => [styles.retryBtn, cardShadow, { backgroundColor: colors.primary, borderRadius: 36, opacity: pressed ? 0.85 : 1 }]}
          >
            <Text style={[styles.retryText, { color: colors.primaryForeground, fontFamily: type.semibold }]}>Try again</Text>
          </Pressable>
          <Pressable onPress={() => router.back()} style={styles.dismissBtn}>
            <Text style={[styles.dismissText, { color: colors.mutedForeground, fontFamily: type.body }]}>Go back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 20) }]}>
      {/* Close */}
      <Pressable onPress={handleClose} style={[styles.closeBtn, cardShadow, { top: insets.top + 14, backgroundColor: colors.card }]}>
        <Feather name="x" size={24} color={colors.foreground} />
      </Pressable>

      <Blob1 color={colors.softBlue} size={300} style={{ position: 'absolute', top: -100, left: -100, opacity: 0.15 }} />

      {/* Prompt */}
      <ScrollView style={styles.promptScroll} contentContainerStyle={styles.promptContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.promptLabel, { color: colors.mutedForeground, fontFamily: type.medium }]}>
          Today&apos;s prompt
        </Text>
        <Text style={[styles.promptText, { color: colors.foreground, fontFamily: type.display }]}>
          {prompt}
        </Text>
      </ScrollView>

      {/* Timer */}
      <View style={styles.timerArea}>
        <Text
          style={[
            styles.timerText,
            {
              color: status === 'recording' && timeLeft <= 10 ? colors.pinkText : colors.accent,
              fontFamily: type.displayBold,
            },
          ]}
        >
          {formatTime(timeLeft)}
        </Text>
        <WaveformVisualizer active={status === 'recording'} />
      </View>

      {/* Button */}
      <View style={styles.buttonArea}>
        <RecordButton
          recording={status === 'recording'}
          onPress={status === 'recording' ? handleStopEarly : startRecording}
        />
        <Text style={[styles.hint, { color: colors.mutedForeground, fontFamily: type.body }]}>
          {status === 'recording' ? 'Tap to stop — or finish all 60 seconds' : 'Tap to begin — you have 60 seconds'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  centeredContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  processingTitle: { fontSize: 24, textAlign: 'center' },
  firstRunLine: { fontSize: 20, lineHeight: 32, textAlign: 'center' },
  processingHint: { fontSize: 16, textAlign: 'center' },
  errorMsg: { fontSize: 16, textAlign: 'center', lineHeight: 24, marginTop: 8 },
  retryBtn: { marginTop: 32, paddingHorizontal: 36, paddingVertical: 16 },
  retryText: { fontSize: 17 },
  dismissBtn: { marginTop: 16, padding: 12 },
  dismissText: { fontSize: 16 },
  closeBtn: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptScroll: { marginTop: 80, marginHorizontal: 32, maxHeight: 200 },
  promptContent: { paddingBottom: 16 },
  promptLabel: { fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 16 },
  promptText: { fontSize: 28, lineHeight: 40 },
  timerArea: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 32 },
  timerText: { fontSize: 80, letterSpacing: -2 },
  buttonArea: { alignItems: 'center', gap: 24, paddingBottom: 24 },
  hint: { fontSize: 14 },
});
