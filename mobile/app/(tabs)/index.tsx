import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { cardShadow, type } from '@/constants/colors';
import { useSession } from '@/contexts/SessionContext';
import { getTodaysPrompt, formatDate } from '@/data/prompts';
import { Blob1, CadenceLogo, Sparkle, StickerAsterisk } from '@/components/Illustrations';

export default function TodayScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { todaysSession, sessions, streak, loading, error, reload } = useSession();

  const prompt = getTodaysPrompt();
  const today = new Date().toISOString();
  const isWeb = Platform.OS === 'web';

  const handleRecord = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: '/recording', params: { prompt } });
  };

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  if (loading) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <View style={[styles.scrollContent, { paddingTop: topPad + 20 }]}>
          <View style={[styles.hero, { backgroundColor: colors.muted, opacity: 0.5, height: 180, borderRadius: colors.radius }]} />
          <View style={[styles.promptCard, { backgroundColor: colors.muted, opacity: 0.4, height: 120, borderRadius: colors.radius }]} />
          <View style={{ height: 60, borderRadius: 30, backgroundColor: colors.muted, opacity: 0.3 }} />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 }]}>
        <Feather name="alert-circle" size={30} color={colors.destructive} />
        <Text style={{ color: colors.foreground, fontFamily: type.semibold, fontSize: 17, marginTop: 14 }}>
          Couldn&apos;t load your sessions
        </Text>
        <Text style={{ color: colors.mutedForeground, fontFamily: type.body, fontSize: 14, textAlign: 'center', marginTop: 6, lineHeight: 21 }}>
          {error}
        </Text>
        <Pressable
          onPress={reload}
          style={({ pressed }) => [{ marginTop: 24, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 30, backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
        >
          <Text style={{ color: colors.primaryForeground, fontFamily: type.semibold, fontSize: 15 }}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: topPad + 12 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header - Editorial Style */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <CadenceLogo size={26} />
            <Text style={[styles.dateText, { color: colors.accent, fontFamily: type.semibold }]}>
              {formatDate(today)}
            </Text>
          </View>
          <View style={styles.headerRight}>
            {streak > 0 && (
              <View style={[styles.streakBadge, { backgroundColor: colors.yellow }]}>
                <Feather name="zap" size={14} color={colors.foreground} />
                <Text style={[styles.streakText, { color: colors.foreground, fontFamily: type.bold }]}>
                  {streak}
                </Text>
              </View>
            )}
            <Pressable onPress={() => router.push('/settings')} style={[styles.gearBtn, { backgroundColor: colors.card }]} hitSlop={8}>
              <Feather name="settings" size={18} color={colors.foreground} />
            </Pressable>
          </View>
        </View>

        {/* Hero Area */}
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, cardShadow, { borderRadius: colors.radius, overflow: 'hidden' }]}
        >
          {/* Decorative shapes inside hero */}
          <Blob1 color={colors.softBlue} size={250} style={{ position: 'absolute', top: -80, right: -60, opacity: 0.4 }} />
          <Sparkle color={colors.pink} size={50} style={{ position: 'absolute', bottom: 20, right: 30, opacity: 0.8 }} />
          
          {/* Hero sits on a dark blue gradient in both themes, so the heading stays white. */}
          <Text style={[styles.heroHeading, { fontFamily: type.displayBold }]}>
            {todaysSession ? 'Done for\ntoday.' : 'Daily\npractice.'}
          </Text>
          <Text style={[styles.heroSub, { fontFamily: type.medium, color: colors.accentSoft }]}>
            {todaysSession
              ? 'Come back tomorrow for a new prompt.'
              : 'One take. Sixty seconds.\nSpeak with intent.'}
          </Text>
        </LinearGradient>

        {todaysSession ? (
          /* Already practiced today */
          <>
            <View style={{ marginTop: 24, position: 'relative' }}>
              <StickerAsterisk color={colors.green} size={40} style={{ position: 'absolute', top: -15, right: 10, zIndex: 10, transform: [{ rotate: '15deg' }] }} />
              <View style={[styles.instructionCard, cardShadow, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
                <Text style={[styles.instructionLabel, { color: colors.accent, fontFamily: type.semibold }]}>
                  Your focus for tomorrow
                </Text>
                <Text style={[styles.instructionText, { color: colors.foreground, fontFamily: type.body }]}>
                  {todaysSession.analysis.instruction}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => router.push(`/results/${todaysSession.id}`)}
              style={({ pressed }) => [
                styles.reviewBtn,
                cardShadow,
                { backgroundColor: colors.primary, borderRadius: colors.radius, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Text style={[styles.reviewBtnText, { color: colors.primaryForeground, fontFamily: type.medium }]}>
                View today&apos;s analysis
              </Text>
              <View style={[styles.reviewArrow, { backgroundColor: colors.primaryForeground + '22' }]}>
                <Feather name="arrow-right" size={15} color={colors.primaryForeground} />
              </View>
            </Pressable>

            <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: type.medium }]}>
              You practiced
            </Text>
            <View style={[styles.promptCard, cardShadow, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
              <Text style={[styles.promptText, { color: colors.mutedForeground, fontFamily: type.body }]}>
                {todaysSession.prompt}
              </Text>
            </View>
          </>
        ) : (
          /* Not yet practiced today */
          <>
            {sessions.length > 0 && (
              <View style={{ marginTop: 12, position: 'relative' }}>
                 <StickerAsterisk color={colors.orange} size={36} style={{ position: 'absolute', top: -12, left: -10, zIndex: 10, transform: [{ rotate: '-10deg' }] }} />
                 <View style={[styles.instructionCard, cardShadow, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
                    <Text style={[styles.instructionLabel, { color: colors.mutedForeground, fontFamily: type.semibold }]}>
                      From last time
                    </Text>
                    <Text style={[styles.instructionText, { color: colors.foreground, fontFamily: type.body, fontStyle: 'italic' }]}>
                      {sessions[0].analysis.instruction}
                    </Text>
                  </View>
              </View>
            )}

            <View style={{ marginTop: 16 }}>
              <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: type.medium }]}>
                Today&apos;s prompt
              </Text>
              <View style={[styles.promptCard, cardShadow, { backgroundColor: colors.card, borderRadius: colors.radius, borderColor: colors.border, borderWidth: 1 }]}>
                <Text style={[styles.promptTextLarge, { color: colors.foreground, fontFamily: type.display }]}>
                  {prompt}
                </Text>
              </View>
            </View>

            {isWeb ? (
              <View style={[styles.webMsg, cardShadow, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
                <View style={[styles.webIconWrap, { backgroundColor: colors.yellow }]}>
                  <Feather name="smartphone" size={24} color={colors.foreground} />
                </View>
                <Text style={[styles.webMsgText, { color: colors.foreground, fontFamily: type.body }]}>
                  Open in Expo Go on your phone to record your response.
                </Text>
              </View>
            ) : (
              <Pressable
                onPress={handleRecord}
                style={({ pressed }) => [
                  styles.recordButton,
                  cardShadow,
                  {
                    backgroundColor: colors.primary,
                    opacity: pressed ? 0.88 : 1,
                    borderRadius: 36, // even more pill-like
                  },
                ]}
              >
                <View style={[styles.micWrap, { backgroundColor: colors.pink }]}>
                  <Feather name="mic" size={20} color="#FFFFFF" />
                </View>
                <Text style={[styles.recordBtnText, { color: colors.primaryForeground, fontFamily: type.semibold }]}>
                  Start recording
                </Text>
                {/* balance mic icon */}
                <View style={{ width: 44 }} />
              </Pressable>
            )}

            <Text style={[styles.recordHint, { color: colors.mutedForeground, fontFamily: type.body }]}>
              Speak for up to 60 seconds. One take.
            </Text>
            {sessions.length > 0 && sessions.length < 7 && (
              <Text style={[styles.recordHint, { color: colors.mutedForeground, fontFamily: type.body, marginTop: 10, opacity: 0.7 }]}>
                Comparisons against your baseline unlock after a week of sessions.
              </Text>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateText: {
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakText: { fontSize: 14 },
  gearBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    padding: 32,
    marginBottom: 16,
    minHeight: 220,
    justifyContent: 'center',
  },
  heroHeading: { fontSize: 44, lineHeight: 48, color: '#FFFFFF', marginBottom: 12, zIndex: 1 },
  heroSub: { fontSize: 16, lineHeight: 24, zIndex: 1 },
  sectionLabel: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginLeft: 8 },
  instructionCard: { padding: 28, marginBottom: 16 },
  instructionLabel: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
  instructionText: { fontSize: 18, lineHeight: 28 },
  reviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginBottom: 32,
  },
  reviewBtnText: { fontSize: 16 },
  reviewArrow: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  promptCard: { padding: 28, marginBottom: 32 },
  promptText: { fontSize: 16, lineHeight: 26 },
  promptTextLarge: { fontSize: 24, lineHeight: 34 },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    marginBottom: 16,
  },
  micWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordBtnText: { fontSize: 18 },
  recordHint: { fontSize: 14, textAlign: 'center' },
  webMsg: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 24, marginBottom: 16 },
  webIconWrap: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  webMsgText: { fontSize: 15, flex: 1, lineHeight: 22 },
});
