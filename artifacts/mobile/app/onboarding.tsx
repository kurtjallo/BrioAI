import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut, ZoomIn } from 'react-native-reanimated';
import { useColors } from '@/hooks/useColors';
import { cardShadow, type } from '@/constants/colors';
import { useSession } from '@/contexts/SessionContext';
import { CONTEXT_PROMPTS } from '@/utils/prompts';
import { buildFirstSession } from '@/utils/mockData';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { setNotificationTime, setSpeakingContext, SpeakingContext } from '@/utils/settings';
import { scheduleDailyReminder } from '@/utils/notifications';
import { Blob1, Blob2, CadenceLogo, Sparkle, Squiggle, StickerAsterisk } from '@/components/Illustrations';

type Step = 'frame' | 'context' | 'record' | 'time' | 'save';

const CONTEXT_OPTIONS: { key: SpeakingContext; label: string }[] = [
  { key: 'meetings', label: 'Meetings' },
  { key: 'presentations', label: 'Presentations' },
  { key: 'interviews', label: 'Interviews' },
  { key: 'everyday', label: 'Everyday conversation' },
];

const PROCESSING_LINES = [
  'We look at the words you chose — and where a sharper one was available.',
  '"Where your point landed" means which sentence carried your main idea, and how long we waited for it.',
  'Filler count is the least interesting part. Word choice and structure change how you sound; "um" mostly doesn\'t.',
];

const TIME_OPTIONS = ['07:30', '08:30', '12:30', '17:30', '19:00', '21:00'];

export default function OnboardingScreen() {
  const params = useLocalSearchParams<{ step?: string }>();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { addSession } = useSession();
  const { completeOnboarding } = useOnboarding();

  const [step, setStep] = useState<Step>((params.step as Step) || 'frame');
  const [prompt, setPrompt] = useState<string>(CONTEXT_PROMPTS.meetings);
  const [simulating, setSimulating] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);
  const [selectedTime, setSelectedTime] = useState('08:30');
  const lineTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Resume at a later step after the first result (results screen sends ?step=time)
  useEffect(() => {
    if (params.step && params.step !== step) setStep(params.step as Step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.step]);

  useEffect(() => {
    return () => {
      if (lineTimer.current) clearInterval(lineTimer.current);
    };
  }, []);

  const pickContext = async (ctx: SpeakingContext) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await setSpeakingContext(ctx);
    setPrompt(CONTEXT_PROMPTS[ctx]);
    setStep('record');
  };

  const startFirstRecording = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (Platform.OS === 'web') {
      // Web preview can't record — simulate the first session with the
      // rotating explanation lines, then show the first result.
      setSimulating(true);
      setLineIdx(0);
      lineTimer.current = setInterval(() => {
        setLineIdx(i => (i + 1) % PROCESSING_LINES.length);
      }, 3200);
      setTimeout(async () => {
        if (lineTimer.current) clearInterval(lineTimer.current);
        const session = buildFirstSession(prompt);
        await addSession(session);
        router.replace({ pathname: '/results/[id]', params: { id: session.id, onboarding: '1' } });
      }, 9600);
    } else {
      router.push({ pathname: '/recording', params: { prompt, onboarding: '1' } });
    }
  }, [prompt, addSession]);

  const confirmTime = async () => {
    await setNotificationTime(selectedTime);
    await scheduleDailyReminder(selectedTime);
    setStep('save');
  };

  const finish = async () => {
    await completeOnboarding();
    router.replace('/(tabs)');
  };

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Math.max(Platform.OS === 'web' ? 34 : insets.bottom, 20);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: topPad, paddingBottom: botPad }]}>
      {step === 'frame' && (
        <Animated.View style={styles.body} entering={FadeIn}>
          <View style={styles.centerBlock}>
            <Animated.View entering={ZoomIn.delay(100).duration(800).springify()}>
              <Blob1 color={colors.yellow} size={350} style={{ position: 'absolute', top: -80, right: -120, opacity: 0.2 }} />
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(200).springify()}>
              <CadenceLogo size={56} style={{ marginBottom: 16 }} />
              <Text style={[styles.super, { color: colors.accent, fontFamily: type.semibold }]}>
                CADENCE
              </Text>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(300).springify()}>
              <Text style={[styles.title, { color: colors.foreground, fontFamily: type.displayBold }]}>
                Speak with{'\n'}intent.
              </Text>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(400).springify()}>
              <Squiggle color={colors.pink} size={80} style={{ marginTop: 10, marginBottom: 20 }} />
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(500).springify()}>
              <Text style={[styles.subtitle, { color: colors.mutedForeground, fontFamily: type.body }]}>
                One 60-second take a day.{'\n'}
                Feedback on your word choice and structure, not just filler words.
              </Text>
            </Animated.View>
          </View>
          <Animated.View entering={FadeInUp.delay(600).springify()}>
            <PrimaryButton label="Start" onPress={() => setStep('context')} colors={colors} />
          </Animated.View>
        </Animated.View>
      )}

      {step === 'context' && (
        <Animated.View style={styles.body} entering={FadeIn}>
          <Blob2 color={colors.purple} size={280} style={{ position: 'absolute', bottom: 100, left: -80, opacity: 0.1 }} />
          <View style={styles.centerBlock}>
            <Animated.View entering={FadeInDown.delay(100).springify()}>
              <Text style={[styles.super, { color: colors.accent, fontFamily: type.semibold }]}>
                FOCUS AREA
              </Text>
              <Text style={[styles.title, { color: colors.foreground, fontFamily: type.displayBold }]}>
                Where does this bite you most?
              </Text>
            </Animated.View>
            <View style={styles.optionList}>
              {CONTEXT_OPTIONS.map((opt, i) => {
                const CONTEXT_COLORS = ['yellow', 'orange', 'purple', 'green'] as const;
                const accentColor = colors[CONTEXT_COLORS[i % CONTEXT_COLORS.length]];
                return (
                  <Animated.View key={opt.key} entering={FadeInDown.delay(200 + i * 100).springify()}>
                    <Pressable
                      onPress={() => pickContext(opt.key)}
                      style={({ pressed }) => [
                        styles.optionCard,
                        cardShadow,
                        {
                          backgroundColor: colors.card,
                          borderRadius: colors.radius,
                          opacity: pressed ? 0.9 : 1,
                          transform: [{ scale: pressed ? 0.97 : 1 }],
                        },
                      ]}
                    >
                      <View style={[styles.optionDot, { backgroundColor: accentColor }]} />
                      <Text style={[styles.optionText, { color: colors.foreground, fontFamily: type.semibold, flex: 1 }]}>
                        {opt.label}
                      </Text>
                      <Feather name="arrow-right" size={20} color={colors.mutedForeground} style={{ opacity: 0.5 }} />
                    </Pressable>
                  </Animated.View>
                );
              })}
            </View>
          </View>
        </Animated.View>
      )}

      {step === 'record' && !simulating && (
        <Animated.View style={styles.body} entering={FadeIn}>
          <Blob1 color={colors.yellow} size={300} style={{ position: 'absolute', top: 40, right: -120, opacity: 0.15 }} />
          <View style={styles.centerBlock}>
            <Animated.View entering={FadeInDown.delay(100).springify()}>
              <Text style={[styles.super, { color: colors.orangeText, fontFamily: type.medium }]}>
                YOUR FIRST PROMPT
              </Text>
            </Animated.View>
            <Animated.View entering={ZoomIn.delay(200).springify()} style={{ position: 'relative', marginTop: 16 }}>
              <StickerAsterisk color={colors.pink} size={40} style={{ position: 'absolute', top: -20, right: -10, transform: [{ rotate: '15deg' }] }} />
              <Text style={[styles.promptText, { color: colors.foreground, fontFamily: type.display }]}>
                {prompt}
              </Text>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(400).springify()}>
              <Text style={[styles.subtitle, { color: colors.mutedForeground, fontFamily: type.body, marginTop: 40 }]}>
                Record your first answer now to establish your starting point.
              </Text>
            </Animated.View>
          </View>
          <Animated.View entering={FadeInUp.delay(500).springify()}>
            <PrimaryButton label="Record" onPress={startFirstRecording} colors={colors} />
          </Animated.View>
        </Animated.View>
      )}

      {step === 'record' && simulating && (
        <Animated.View style={[styles.body, { justifyContent: 'center' }]} entering={FadeIn}>
          <View style={[styles.centerBlock, { alignItems: 'center' }]}>
            <Animated.View entering={ZoomIn.duration(800).springify()}>
              <Sparkle color={colors.yellow} size={64} style={{ marginBottom: 32 }} />
            </Animated.View>
            <View style={{ height: 140, alignItems: 'center', width: '100%', position: 'relative' }}>
              <Animated.Text
                key={lineIdx}
                entering={FadeIn.duration(400)}
                exiting={FadeOut.duration(400)}
                style={[styles.processingLine, { color: colors.foreground, fontFamily: type.body, position: 'absolute', width: '100%' }]}
              >
                {PROCESSING_LINES[lineIdx]}
              </Animated.Text>
            </View>
          </View>
        </Animated.View>
      )}

      {step === 'time' && (
        <Animated.View style={styles.body} entering={FadeIn}>
          <Blob2 color={colors.softBlue} size={250} style={{ position: 'absolute', top: 100, left: -100, opacity: 0.15 }} />
          <ScrollView contentContainerStyle={styles.scrollCenterBlock} showsVerticalScrollIndicator={false}>
            <Animated.View entering={FadeInDown.delay(100).springify()}>
              <Text style={[styles.super, { color: colors.accent, fontFamily: type.semibold }]}>
                DAILY RITUAL
              </Text>
              <Text style={[styles.title, { color: colors.foreground, fontFamily: type.displayBold }]}>
                When are you somewhere you can talk out loud?
              </Text>
            </Animated.View>
            <View style={styles.timeGrid}>
              {TIME_OPTIONS.map((t, i) => {
                const selected = t === selectedTime;
                return (
                  <Animated.View key={t} entering={FadeInDown.delay(200 + i * 50).springify()} style={styles.timeChipContainer}>
                    <Pressable
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setSelectedTime(t);
                      }}
                      style={({ pressed }) => [
                        styles.timeChip,
                        selected && cardShadow,
                        {
                          backgroundColor: selected ? colors.card : colors.background,
                          borderColor: selected ? 'transparent' : colors.border,
                          borderWidth: selected ? 0 : 1,
                          borderRadius: colors.radiusSm,
                          transform: [{ scale: pressed ? 0.95 : 1 }],
                        },
                      ]}
                    >
                      {selected && <Sparkle color={colors.accent} size={16} style={{ position: 'absolute', top: 12, right: 12 }} />}
                      <Text
                        style={[
                          styles.timeChipText,
                          {
                            color: selected ? colors.accent : colors.mutedForeground,
                            fontFamily: selected ? type.bold : type.medium,
                          },
                        ]}
                      >
                        {formatTime(t)}
                      </Text>
                    </Pressable>
                  </Animated.View>
                );
              })}
            </View>
          </ScrollView>
          <Animated.View entering={FadeInUp.delay(500).springify()}>
            <PrimaryButton label="Remind me then" onPress={confirmTime} colors={colors} />
          </Animated.View>
        </Animated.View>
      )}

      {step === 'save' && (
        <Animated.View style={styles.body} entering={FadeIn}>
          <Blob1 color={colors.green} size={250} style={{ position: 'absolute', top: -30, right: -80, opacity: 0.15 }} />
          <View style={styles.centerBlock}>
            <Animated.View entering={ZoomIn.delay(100).springify()}>
              <View style={[styles.saveIconWrap, { backgroundColor: colors.accentSoft }]}>
                <Feather name="lock" size={40} color={colors.accent} />
                <StickerAsterisk color={colors.pink} size={32} style={{ position: 'absolute', bottom: -10, right: -10, transform: [{ rotate: '15deg' }] }} />
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200).springify()}>
              <Text style={[styles.title, { color: colors.foreground, fontFamily: type.displayBold }]}>
                Your sessions stay on this device for now.
              </Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300).springify()}>
              <Text style={[styles.subtitle, { color: colors.mutedForeground, fontFamily: type.body }]}>
                Accounts are coming — you&apos;ll be able to save your history later.
              </Text>
            </Animated.View>
          </View>
          <Animated.View entering={FadeInUp.delay(500).springify()}>
            <PrimaryButton label="Continue" onPress={finish} colors={colors} />
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
}

function PrimaryButton({ label, onPress, colors }: {
  label: string;
  onPress: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryBtn,
        cardShadow,
        { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
      ]}
    >
      <Text style={[styles.primaryBtnText, { color: colors.primaryForeground, fontFamily: type.semibold }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  body: { flex: 1, paddingHorizontal: 32, justifyContent: 'space-between', paddingTop: 40 },
  centerBlock: { flex: 1, justifyContent: 'center', gap: 16 },
  scrollCenterBlock: { flexGrow: 1, justifyContent: 'center', gap: 16, paddingBottom: 24 },
  super: { fontSize: 13, letterSpacing: 1.5, marginBottom: 8, textTransform: 'uppercase' },
  title: { fontSize: 44, lineHeight: 52, marginBottom: 8 },
  subtitle: { fontSize: 18, lineHeight: 28 },
  promptText: { fontSize: 36, lineHeight: 48 },
  optionList: { gap: 12, marginTop: 24 },
  optionCard: { paddingVertical: 20, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', gap: 16 },
  optionDot: { width: 12, height: 12, borderRadius: 6 },
  optionText: { fontSize: 18 },
  processingLine: { fontSize: 22, lineHeight: 34, textAlign: 'center' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 32 },
  timeChipContainer: { width: '47%' },
  timeChip: { width: '100%', paddingVertical: 20, alignItems: 'center' },
  timeChipText: { fontSize: 16 },
  saveIconWrap: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  primaryBtn: { paddingVertical: 18, borderRadius: 36, alignItems: 'center', marginTop: 20 },
  primaryBtnText: { fontSize: 17 },
});
