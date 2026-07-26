import React, { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { cardShadow, type } from '@/constants/colors';
import { useWords } from '@/contexts/WordContext';
import { WordEntry } from '@/types';
import { Sparkle, Blob2, StickerAsterisk } from '@/components/Illustrations';

export default function PracticeScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { todaysWord, dueForReview, userWords, markPracticed } = useWords();

  const [wordDone, setWordDone] = useState(false);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [reviewDone, setReviewDone] = useState(false);
  const pressStartRef = useRef<number>(0);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const handleWordPracticed = async () => {
    if (!todaysWord) return;
    const elapsed = Date.now() - pressStartRef.current;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await markPracticed(todaysWord.id, elapsed);
    setWordDone(true);
  };

  const handleReviewDone = async (word: WordEntry) => {
    const elapsed = Date.now() - pressStartRef.current;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await markPracticed(word.id, elapsed);
    if (reviewIdx + 1 >= dueForReview.length) {
      setReviewDone(true);
    } else {
      setReviewIdx(i => i + 1);
    }
  };

  const currentReview = dueForReview[reviewIdx];

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad + 12, paddingBottom: botPad + 40 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Text style={[styles.heading, { color: colors.foreground, fontFamily: type.displayBold }]}>
        Practice
      </Text>

      {/* Word of the day */}
      {todaysWord && (
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: type.medium }]}>
            Word of the day
          </Text>

          <View style={[styles.wordCard, cardShadow, { backgroundColor: colors.card, borderRadius: colors.radius, overflow: 'hidden' }]}>
            <Blob2 color={colors.yellow} size={150} style={{ position: 'absolute', top: -40, right: -40, opacity: 0.2 }} />
            
            <Text style={[styles.wordText, { color: colors.accent, fontFamily: type.displayBold }]}>
              {todaysWord.word}
            </Text>
            <Text style={[styles.definitionText, { color: colors.foreground, fontFamily: type.body }]}>
              {todaysWord.definition}
            </Text>

            <View style={[styles.exampleBlock, { backgroundColor: colors.secondary, borderRadius: colors.radiusSm }]}>
              <Text style={[styles.exampleLabel, { color: colors.mutedForeground, fontFamily: type.semibold }]}>
                Example
              </Text>
              <Text style={[styles.exampleText, { color: colors.foreground, fontFamily: type.body }]}>
                {todaysWord.example}
              </Text>
            </View>

            {wordDone ? (
              <View style={[styles.doneRow, { backgroundColor: colors.green + '20', borderRadius: colors.radiusSm }]}>
                <Feather name="check-circle" size={20} color={colors.greenText} />
                <Text style={[styles.doneText, { color: colors.greenText, fontFamily: type.semibold }]}>
                  Practiced
                </Text>
              </View>
            ) : (
              <>
                <Text style={[styles.instructionText, { color: colors.mutedForeground, fontFamily: type.body }]}>
                  Say a sentence out loud using this word, then tap done.
                </Text>
                <Pressable
                  onPressIn={() => { pressStartRef.current = Date.now(); }}
                  onPress={handleWordPracticed}
                  style={({ pressed }) => [
                    styles.doneButton,
                    { backgroundColor: colors.primary, borderRadius: 36, opacity: pressed ? 0.85 : 1 },
                  ]}
                >
                  <Text style={[styles.doneButtonText, { color: colors.primaryForeground, fontFamily: type.semibold }]}>I said it</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      )}

      {/* Review queue */}
      {dueForReview.length > 0 && !reviewDone && (
        <View style={[styles.section, { marginTop: 32 }]}>
          <View style={styles.reviewHeader}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: type.medium }]}>
              Review
            </Text>
            <View style={[styles.badge, { backgroundColor: colors.orange }]}>
              <Text style={[styles.badgeText, { color: '#FFFFFF', fontFamily: type.bold }]}>
                {dueForReview.length} due
              </Text>
            </View>
          </View>

          {currentReview && (
            <View style={[styles.reviewCard, cardShadow, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
              <Text style={[styles.reviewProgress, { color: colors.mutedForeground, fontFamily: type.body }]}>
                {reviewIdx + 1} of {dueForReview.length}
              </Text>
              <Text style={[styles.wordText, { color: colors.accent, fontFamily: type.displayBold }]}>
                {currentReview.word}
              </Text>
              <Text style={[styles.definitionText, { color: colors.foreground, fontFamily: type.body }]}>
                {currentReview.definition}
              </Text>
              <Text style={[styles.instructionText, { color: colors.mutedForeground, fontFamily: type.body }]}>
                Use it in a sentence, then tap done.
              </Text>
              <Pressable
                onPressIn={() => { pressStartRef.current = Date.now(); }}
                onPress={() => handleReviewDone(currentReview)}
                style={({ pressed }) => [
                  styles.doneButton,
                  { backgroundColor: colors.secondary, borderRadius: 36, opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Text style={[styles.doneButtonText, { color: colors.foreground, fontFamily: type.semibold }]}>Done</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}

      {reviewDone && dueForReview.length > 0 && (
        <View style={[styles.section, { marginTop: 32 }]}>
          <View style={[styles.allDoneCard, cardShadow, { backgroundColor: colors.card, borderRadius: colors.radius, overflow: 'hidden' }]}>
            <Sparkle color={colors.yellow} size={60} style={{ position: 'absolute', top: -10, left: -10, opacity: 0.5 }} />
            <View style={[styles.doneIconWrap, { backgroundColor: colors.green }]}>
              <Feather name="check" size={24} color="#FFFFFF" />
            </View>
            <Text style={[styles.allDoneText, { color: colors.foreground, fontFamily: type.semibold }]}>
              Review complete
            </Text>
            <Text style={[styles.allDoneHint, { color: colors.mutedForeground, fontFamily: type.body }]}>
              {dueForReview.length} {dueForReview.length === 1 ? 'word' : 'words'} reviewed
            </Text>
          </View>
        </View>
      )}

      {/* Word list summary */}
      <View style={[styles.section, { marginTop: 32 }]}>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: type.medium }]}>
          Your list
        </Text>
        {userWords.length === 0 ? (
          <View style={[styles.emptyList, { borderColor: colors.border, borderRadius: colors.radius }]}>
            <Feather name="book-open" size={24} color={colors.mutedForeground} />
            <Text style={[styles.emptyListText, { color: colors.mutedForeground, fontFamily: type.body }]}>
              Words you practice will appear here
            </Text>
          </View>
        ) : (
          <View style={[styles.listContainer, cardShadow, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
            {userWords.slice(0, 8).map((word, index) => (
              <View key={word.id} style={[styles.listItem, { borderBottomColor: index === Math.min(userWords.length, 8) - 1 ? 'transparent' : colors.border }]}>
                <Text style={[styles.listWord, { color: colors.foreground, fontFamily: type.semibold }]}>
                  {word.word}
                </Text>
                <Text style={[styles.listSource, { color: colors.mutedForeground, fontFamily: type.body }]}>
                  {word.source === 'upgrade' ? 'From your speech' : 'Daily word'}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 24 },
  heading: { fontSize: 36, marginBottom: 28 },
  section: {},
  sectionLabel: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginLeft: 8 },
  wordCard: { padding: 28 },
  wordText: { fontSize: 40, marginBottom: 12 },
  definitionText: { fontSize: 18, lineHeight: 28, marginBottom: 20 },
  exampleBlock: { padding: 18, marginBottom: 20 },
  exampleLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  exampleText: { fontSize: 16, lineHeight: 24, fontStyle: 'italic' },
  instructionText: { fontSize: 14, lineHeight: 22, marginBottom: 16 },
  doneButton: { paddingVertical: 18, alignItems: 'center' },
  doneButtonText: { fontSize: 16 },
  doneRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 14, marginTop: 4 },
  doneText: { fontSize: 16 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12, marginLeft: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12 },
  reviewCard: { padding: 28 },
  reviewProgress: { fontSize: 14, marginBottom: 16 },
  allDoneCard: { padding: 32, alignItems: 'center', gap: 12 },
  doneIconWrap: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  allDoneText: { fontSize: 20 },
  allDoneHint: { fontSize: 15 },
  emptyList: { borderWidth: 1, borderStyle: 'dashed', padding: 32, alignItems: 'center', gap: 12 },
  emptyListText: { fontSize: 15 },
  listContainer: { paddingHorizontal: 24, paddingVertical: 8 },
  listItem: { paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  listWord: { fontSize: 17 },
  listSource: { fontSize: 13 },
});
