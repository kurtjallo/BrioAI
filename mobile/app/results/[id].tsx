import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer, type AudioStatus } from 'expo-audio';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { cardShadow, type } from '@/constants/colors';
import { useSession } from '@/contexts/SessionContext';
import { useWords } from '@/contexts/WordContext';
import WordUpgradeCard from '@/components/WordUpgradeCard';
import { Blob2, Squiggle, StickerAsterisk } from '@/components/Illustrations';

export default function ResultsScreen() {
  const { id, onboarding } = useLocalSearchParams<{ id: string; onboarding?: string }>();
  const isOnboarding = onboarding === '1';
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { getSessionById } = useSession();
  const { addWordFromUpgrade } = useWords();

  const session = getSessionById(id ?? '');

  if (!session) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <View style={styles.empty}>
          <Feather name="alert-circle" size={32} color={colors.mutedForeground} />
          <Text style={[styles.emptyText, { color: colors.mutedForeground, fontFamily: type.body }]}>
            Session not found
          </Text>
          <Pressable onPress={() => router.replace('/')} style={[styles.homeBtn, { backgroundColor: colors.secondary, borderRadius: colors.radiusSm }]}>
            <Text style={[styles.homeBtnText, { color: colors.foreground, fontFamily: type.medium }]}>Go home</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const { analysis } = session;
  const { structure, vocabulary, delivery, wordUpgrades } = analysis;

  const complexityLabel: Record<string, string> = {
    simple: 'Simple — clear and direct',
    moderate: 'Moderate — some complexity',
    complex: 'Complex — heavily nested',
  };
  const endingLabel: Record<string, string> = {
    clean: 'Clean close',
    fade: 'Trails off',
    abrupt: 'Abrupt stop',
  };
  const endingColor: Record<string, string> = {
    clean: colors.green,
    fade: colors.mutedForeground,
    abrupt: colors.destructive,
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 40,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          {!isOnboarding && (
            <Pressable onPress={() => router.replace('/')} style={styles.backBtn}>
              <Feather name="x" size={24} color={colors.foreground} />
            </Pressable>
          )}
          <Text style={[styles.headerTitle, { color: colors.foreground, fontFamily: type.semibold }]}>
            {isOnboarding ? 'YOUR FIRST SESSION' : 'TODAY\u2019S SESSION'}
          </Text>
        </View>

        {/* 1. The instruction — most important */}
        <View style={{ marginBottom: 16, position: 'relative' }}>
          <StickerAsterisk color={colors.yellow} size={48} style={{ position: 'absolute', top: -15, left: -10, zIndex: 10, transform: [{ rotate: '-15deg' }] }} />
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.instructionCard, cardShadow, { borderRadius: colors.radius }]}
          >
            <Text style={[styles.instructionLabel, { color: 'rgba(255,255,255,0.85)', fontFamily: type.semibold }]}>
              Try this tomorrow
            </Text>
            <Text style={[styles.instructionText, { color: '#FFFFFF', fontFamily: type.medium }]}>
              {analysis.instruction}
            </Text>
          </LinearGradient>
        </View>

        {/* 2. Word upgrades */}
        <Section title="Word upgrades" colors={colors}>
          {wordUpgrades.length > 0 ? (
            wordUpgrades.map((upgrade, i) => (
              <WordUpgradeCard
                key={i}
                upgrade={upgrade}
                onAddToList={() =>
                  addWordFromUpgrade(upgrade.suggestion, `More precise than "${upgrade.original}"`, upgrade.improvedSentence)
                }
              />
            ))
          ) : (
            <View style={[styles.structureBlock, cardShadow, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
              <Text style={[styles.blockValue, { color: colors.foreground, fontFamily: type.body }]}>
                Nothing worth swapping this time — your word choice held up.
              </Text>
            </View>
          )}
        </Section>

        {/* 3. Structure */}
        <Section title="Structure" colors={colors}>
          {/* Point placement */}
          <View style={[styles.structureBlock, cardShadow, { backgroundColor: colors.card, borderRadius: colors.radius, overflow: 'hidden' }]}>
            <Blob2 color={colors.softBlue} size={150} style={{ position: 'absolute', top: -60, right: -40, opacity: 0.15 }} />
            <Text style={[styles.blockLabel, { color: colors.mutedForeground, fontFamily: type.semibold }]}>
              Main point
            </Text>
            <Text style={[styles.blockValue, { color: colors.foreground, fontFamily: type.body }]}>
              Arrived in sentence {structure.pointPlacement.position} of {structure.pointPlacement.total}
              {structure.pointPlacement.position > structure.pointPlacement.total * 0.5
                ? ' — consider leading with it'
                : ' — good placement'}
            </Text>
            {structure.pointPlacement.sentence ? (
              <Text style={[styles.quotedSentence, { color: colors.accent, fontFamily: type.body }]}>
                &ldquo;{structure.pointPlacement.sentence}&rdquo;
              </Text>
            ) : null}
          </View>

          {/* Signposting */}
          <View style={[styles.structureBlock, cardShadow, { backgroundColor: colors.card, borderRadius: colors.radius, marginTop: 12 }]}>
            <Text style={[styles.blockLabel, { color: colors.mutedForeground, fontFamily: type.semibold }]}>
              Signposting
            </Text>
            {structure.signposting.length > 0 ? (
              <View style={styles.pillRow}>
                {structure.signposting.map((s, i) => (
                  <View key={i} style={[styles.signpostPill, { backgroundColor: colors.secondary }]}>
                    <Text style={[styles.signpostText, { color: colors.foreground, fontFamily: type.medium }]}>{s}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={[styles.blockValue, { color: colors.mutedForeground, fontFamily: type.body }]}>
                No signposting detected — try: &quot;the key point is&quot;, &quot;to summarise&quot;
              </Text>
            )}
          </View>

          {/* Complexity + ending row */}
          <View style={[styles.rowTwo, { marginTop: 12, gap: 12 }]}>
            <View style={[styles.halfBlock, cardShadow, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
              <Text style={[styles.blockLabel, { color: colors.mutedForeground, fontFamily: type.semibold }]}>Sentences</Text>
              <Text style={[styles.blockValue, { color: colors.foreground, fontFamily: type.body }]}>
                {complexityLabel[structure.sentenceComplexity] ?? structure.sentenceComplexity}
              </Text>
            </View>
            <View style={[styles.halfBlock, cardShadow, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
              <Text style={[styles.blockLabel, { color: colors.mutedForeground, fontFamily: type.semibold }]}>Ending</Text>
              <Text style={[styles.blockValue, { color: endingColor[structure.ending] ?? colors.foreground, fontFamily: type.body }]}>
                {endingLabel[structure.ending] ?? structure.ending}
              </Text>
            </View>
          </View>
        </Section>

        {/* 4. Vocabulary */}
        <Section title="Vocabulary" colors={colors}>
          {!isOnboarding && (
            <View style={styles.rowTwo}>
              <View style={[styles.halfBlock, cardShadow, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
                <Text style={[styles.metricNum, { color: colors.accent, fontFamily: type.bold }]}>
                  {Math.round(vocabulary.lexicalDiversity * 100)}%
                </Text>
                <Text style={[styles.blockLabel, { color: colors.mutedForeground, fontFamily: type.semibold }]}>Diversity</Text>
              </View>
              <View style={[styles.halfBlock, cardShadow, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
                <Text style={[styles.metricNum, { color: vocabulary.vagueWordDensity > 0.1 ? colors.orangeText : colors.foreground, fontFamily: type.bold }]}>
                  {Math.round(vocabulary.vagueWordDensity * 100)}%
                </Text>
                <Text style={[styles.blockLabel, { color: colors.mutedForeground, fontFamily: type.semibold }]}>Vague words</Text>
              </View>
            </View>
          )}
          {vocabulary.vagueWords.length > 0 && (
            <View style={[styles.tagBlock, { marginTop: 16 }]}>
              <Text style={[styles.blockLabel, { color: colors.mutedForeground, fontFamily: type.semibold, marginBottom: 8 }]}>
                Flagged
              </Text>
              <View style={styles.pillRow}>
                {vocabulary.vagueWords.map((w, i) => (
                  <View key={i} style={[styles.signpostPill, { backgroundColor: colors.pink + '20' }]}>
                    <Text style={[styles.signpostText, { color: colors.pinkText, fontFamily: type.semibold }]}>{w}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          {vocabulary.repetitions.length > 0 && (
            <View style={[styles.tagBlock, { marginTop: 16 }]}>
              <Text style={[styles.blockLabel, { color: colors.mutedForeground, fontFamily: type.semibold, marginBottom: 8 }]}>
                Repeated
              </Text>
              <View style={styles.pillRow}>
                {vocabulary.repetitions.map((r, i) => (
                  <View key={i} style={[styles.signpostPill, { backgroundColor: colors.secondary }]}>
                    <Text style={[styles.signpostText, { color: colors.foreground, fontFamily: type.medium }]}>
                      {r.word} ×{r.count}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </Section>

        {/* 5. Delivery */}
        <Section title="Delivery" small colors={colors}>
          <View style={[styles.deliveryRow, cardShadow, { backgroundColor: colors.card, borderRadius: colors.radius, padding: 24 }]}>
            <DeliveryItem label="Filler rate" value={`${delivery.fillerRate.toFixed(1)}/100w`} colors={colors} />
            <View style={{ width: 1, height: 30, backgroundColor: colors.border }} />
            <DeliveryItem label="Words" value={String(delivery.wordCount)} colors={colors} />
            <View style={{ width: 1, height: 30, backgroundColor: colors.border }} />
            <DeliveryItem label="Pace" value={`~${delivery.estimatedPace} wpm`} colors={colors} />
          </View>
        </Section>

        {/* 6. Transcript */}
        <Section title="Transcript" colors={colors}>
          <View style={[styles.transcriptCard, cardShadow, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
            {session.audioUri ? <PlaybackControl uri={session.audioUri} colors={colors} /> : null}
            <TranscriptText
              transcript={session.transcript}
              vagueWords={vocabulary.vagueWords}
              colors={colors}
            />
            {(vocabulary.vagueWords.length > 0 || hasFillers(session.transcript)) && (
              <View style={styles.legendRow}>
                {hasFillers(session.transcript) && (
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.orange }]} />
                    <Text style={[styles.legendText, { color: colors.mutedForeground, fontFamily: type.medium }]}>Fillers</Text>
                  </View>
                )}
                {vocabulary.vagueWords.length > 0 && (
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.pink }]} />
                    <Text style={[styles.legendText, { color: colors.mutedForeground, fontFamily: type.medium }]}>Vague words</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </Section>

        {isOnboarding && (
          <Pressable
            onPress={() => router.replace({ pathname: '/onboarding', params: { step: 'time' } })}
            style={({ pressed }) => [
              styles.continueBtn,
              cardShadow,
              { backgroundColor: colors.primary, opacity: pressed ? 0.88 : 1 },
            ]}
          >
            <Text style={[styles.continueText, { color: colors.primaryForeground, fontFamily: type.semibold }]}>
              Continue
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const FILLER_WORDS = new Set([
  'um', 'uh', 'erm', 'er', 'hmm', 'like', 'basically', 'actually', 'literally',
]);
const FILLER_PHRASES = ['you know', 'i mean', 'kind of', 'sort of'];

function normalize(word: string): string {
  return word.toLowerCase().replace(/[^a-z']/g, '');
}

function hasFillers(transcript: string): boolean {
  const lower = transcript.toLowerCase();
  if (FILLER_PHRASES.some((p) => lower.includes(p))) return true;
  return transcript.split(/\s+/).some((w) => FILLER_WORDS.has(normalize(w)));
}

type Token = { text: string; kind: 'plain' | 'filler' | 'vague' };

function tokenizeTranscript(transcript: string, vagueWords: string[]): Token[] {
  const vagueSet = new Set(vagueWords.map((w) => w.toLowerCase()));
  const words = transcript.split(/(\s+)/);
  const tokens: Token[] = [];

  for (let i = 0; i < words.length; i++) {
    const piece = words[i];
    if (/^\s+$/.test(piece) || piece === '') {
      tokens.push({ text: piece, kind: 'plain' });
      continue;
    }
    const norm = normalize(piece);
    // Check two-word filler phrases (current word + next word)
    let nextIdx = i + 1;
    while (nextIdx < words.length && /^\s*$/.test(words[nextIdx])) nextIdx++;
    const nextNorm = nextIdx < words.length ? normalize(words[nextIdx]) : '';
    const phrase = `${norm} ${nextNorm}`;
    if (nextNorm && FILLER_PHRASES.includes(phrase)) {
      const joined = words.slice(i, nextIdx + 1).join('');
      tokens.push({ text: joined, kind: 'filler' });
      i = nextIdx;
      continue;
    }
    if (vagueSet.has(norm)) {
      tokens.push({ text: piece, kind: 'vague' });
    } else if (FILLER_WORDS.has(norm)) {
      tokens.push({ text: piece, kind: 'filler' });
    } else {
      tokens.push({ text: piece, kind: 'plain' });
    }
  }
  return tokens;
}

function TranscriptText({ transcript, vagueWords, colors }: {
  transcript: string;
  vagueWords: string[];
  colors: ReturnType<typeof useColors>;
}) {
  const tokens = React.useMemo(() => tokenizeTranscript(transcript, vagueWords), [transcript, vagueWords]);
  return (
    <Text style={[styles.transcript, { color: colors.foreground, fontFamily: type.body }]}>
      {tokens.map((t, i) => {
        if (t.kind === 'filler') {
          return (
            <Text key={i} style={{ color: colors.orangeText, fontFamily: type.semibold, backgroundColor: colors.orange + '18' }}>
              {t.text}
            </Text>
          );
        }
        if (t.kind === 'vague') {
          return (
            <Text key={i} style={{ color: colors.pinkText, fontFamily: type.semibold, backgroundColor: colors.pink + '18' }}>
              {t.text}
            </Text>
          );
        }
        return t.text;
      })}
    </Text>
  );
}

function formatMillis(ms: number): string {
  const totalSec = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function PlaybackControl({ uri, colors }: { uri: string; colors: ReturnType<typeof useColors> }) {
  const playerRef = useRef<AudioPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);

  // Scrubbing state: while the user drags, the bar follows the finger and
  // status updates are ignored until the seek completes.
  const [dragRatio, setDragRatio] = useState<number | null>(null);
  const draggingRef = useRef(false);
  const barWidthRef = useRef(1);
  const barXRef = useRef(0);
  const barRef = useRef<View | null>(null);

  useEffect(() => {
    return () => {
      try { playerRef.current?.remove(); } catch { /* ignore */ }
      playerRef.current = null;
    };
  }, []);

  const onStatus = (status: AudioStatus) => {
    if (!status.isLoaded) return;
    if (!draggingRef.current) {
      setPositionMillis(Math.max(0, (status.currentTime ?? 0) * 1000));
    }
    if (status.duration) setDurationMillis(status.duration * 1000);
    if (status.didJustFinish) {
      setIsPlaying(false);
      setPositionMillis(0);
      try {
        playerRef.current?.pause();
        playerRef.current?.seekTo(0);
      } catch { /* ignore */ }
    }
  };

  const ensureLoaded = async (): Promise<AudioPlayer | null> => {
    if (playerRef.current) return playerRef.current;
    try {
      setIsLoading(true);
      await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
      const player = createAudioPlayer({ uri }, { updateInterval: 250 });
      playerRef.current = player;
      if (player.isLoaded && player.duration) setDurationMillis(player.duration * 1000);
      player.addListener('playbackStatusUpdate', onStatus);
      return player;
    } catch {
      setError(true);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayback = async () => {
    try {
      const player = await ensureLoaded();
      if (!player) return;
      if (isPlaying) {
        player.pause();
        setIsPlaying(false);
      } else {
        player.play();
        setIsPlaying(true);
      }
    } catch {
      setError(true);
    }
  };

  const seekToRatio = async (ratio: number) => {
    const player = await ensureLoaded();
    if (!player || !durationMillis) return;
    const clamped = Math.min(1, Math.max(0, ratio));
    const target = Math.round(clamped * durationMillis);
    setPositionMillis(target);
    try {
      await player.seekTo(target / 1000);
    } catch {
      /* ignore seek errors */
    }
  };

  const ratioFromPageX = (pageX: number) =>
    Math.min(1, Math.max(0, (pageX - barXRef.current) / Math.max(1, barWidthRef.current)));

  const measureBar = () => {
    barRef.current?.measure?.((_x, _y, w, _h, px) => {
      if (w) barWidthRef.current = w;
      if (typeof px === 'number') barXRef.current = px;
    });
  };

  if (error) {
    return (
      <Text style={[styles.playbackError, { color: colors.mutedForeground, fontFamily: type.body }]}>
        Recording unavailable
      </Text>
    );
  }

  const shownRatio =
    dragRatio !== null
      ? dragRatio
      : durationMillis > 0
        ? Math.min(1, positionMillis / durationMillis)
        : 0;
  const shownMillis = dragRatio !== null ? dragRatio * durationMillis : positionMillis;

  return (
    <View style={[styles.playRow, { backgroundColor: colors.secondary, borderRadius: colors.radiusSm }]}>
      <Pressable
        onPress={togglePlayback}
        disabled={isLoading}
        accessibilityRole="button"
        accessibilityLabel={isPlaying ? 'Pause recording' : 'Play recording'}
        style={({ pressed }) => [styles.playCircle, { backgroundColor: colors.primary, opacity: pressed || isLoading ? 0.7 : 1 }]}
      >
        <Feather name={isPlaying ? 'pause' : 'play'} size={16} color={colors.primaryForeground} style={isPlaying ? undefined : { marginLeft: 2 }} />
      </Pressable>

      <View style={styles.progressArea}>
        <View
          ref={barRef}
          onLayout={measureBar}
          accessibilityRole="adjustable"
          accessibilityLabel="Playback position"
          hitSlop={{ top: 12, bottom: 12 }}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={(e) => {
            measureBar();
            draggingRef.current = true;
            setDragRatio(ratioFromPageX(e.nativeEvent.pageX));
          }}
          onResponderMove={(e) => {
            setDragRatio(ratioFromPageX(e.nativeEvent.pageX));
          }}
          onResponderRelease={async (e) => {
            const ratio = ratioFromPageX(e.nativeEvent.pageX);
            await seekToRatio(ratio);
            draggingRef.current = false;
            setDragRatio(null);
          }}
          onResponderTerminate={() => {
            draggingRef.current = false;
            setDragRatio(null);
          }}
          style={styles.progressTrackWrap}
        >
          <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
            <View style={[styles.progressFill, { backgroundColor: colors.accent, width: `${shownRatio * 100}%` }]} />
          </View>
          <View
            style={[
              styles.progressThumb,
              {
                backgroundColor: colors.accent,
                left: `${shownRatio * 100}%`,
              },
            ]}
            pointerEvents="none"
          />
        </View>
        <View style={styles.timeRow}>
          <Text style={[styles.timeText, { color: colors.mutedForeground, fontFamily: type.medium }]}>
            {isLoading ? '…' : formatMillis(shownMillis)}
          </Text>
          <Text style={[styles.timeText, { color: colors.mutedForeground, fontFamily: type.medium }]}>
            {durationMillis > 0 ? formatMillis(durationMillis) : '–:––'}
          </Text>
        </View>
      </View>
    </View>
  );
}

function Section({ title, children, small, colors }: {
  title: string;
  children: React.ReactNode;
  small?: boolean;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.section}>
      <Text style={[
        styles.sectionTitle,
        {
          color: small ? colors.mutedForeground : colors.foreground,
          fontFamily: type.displayBold,
          fontSize: small ? 14 : 24,
        },
      ]}>
        {small ? title.toUpperCase() : title}
      </Text>
      {small && <Squiggle color={colors.yellow} size={40} style={{ position: 'absolute', top: -10, right: 0 }} />}
      {children}
    </View>
  );
}

function DeliveryItem({ label, value, colors }: { label: string; value: string; colors: ReturnType<typeof useColors> }) {
  return (
    <View style={styles.deliveryItem}>
      <Text style={[styles.deliveryValue, { color: colors.foreground, fontFamily: type.bold }]}>{value}</Text>
      <Text style={[styles.deliveryLabel, { color: colors.mutedForeground, fontFamily: type.body }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 40 },
  emptyText: { fontSize: 16 },
  homeBtn: { marginTop: 8, paddingHorizontal: 28, paddingVertical: 14 },
  homeBtnText: { fontSize: 15 },
  scrollContent: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 28, gap: 12 },
  backBtn: { padding: 4, marginLeft: -4 },
  headerTitle: { fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.2 },
  instructionCard: {
    padding: 32,
    marginBottom: 8,
  },
  instructionLabel: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  instructionText: { fontSize: 20, lineHeight: 30 },
  section: { marginTop: 40 },
  sectionTitle: { letterSpacing: 0, marginBottom: 20 },
  structureBlock: { padding: 24 },
  blockLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  blockValue: { fontSize: 15, lineHeight: 24 },
  quotedSentence: { fontSize: 15, lineHeight: 24, fontStyle: 'italic', marginTop: 12 },
  rowTwo: { flexDirection: 'row', gap: 12 },
  halfBlock: { flex: 1, padding: 24 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  signpostPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  signpostText: { fontSize: 14 },
  tagBlock: {},
  metricNum: { fontSize: 36, marginBottom: 8 },
  deliveryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  deliveryItem: { alignItems: 'center', flex: 1 },
  deliveryValue: { fontSize: 18, marginBottom: 4 },
  deliveryLabel: { fontSize: 12 },
  continueBtn: { marginTop: 40, paddingVertical: 18, borderRadius: 36, alignItems: 'center' },
  continueText: { fontSize: 17 },
  transcriptCard: { padding: 24 },
  transcript: { fontSize: 16, lineHeight: 28 },
  playRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, marginBottom: 16 },
  playCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  playText: { fontSize: 15 },
  progressArea: { flex: 1 },
  progressTrackWrap: { justifyContent: 'center', height: 24 },
  progressTrack: { height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: 4, borderRadius: 2 },
  progressThumb: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    marginLeft: -7,
    top: 5,
  },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  timeText: { fontSize: 11, fontVariant: ['tabular-nums'] },
  playbackError: { fontSize: 13, marginBottom: 12 },
  legendRow: { flexDirection: 'row', gap: 16, marginTop: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 12 },
});
