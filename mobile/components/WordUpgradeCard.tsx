import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { cardShadow } from '@/constants/colors';
import { WordUpgrade } from '@/types';

interface WordUpgradeCardProps {
  upgrade: WordUpgrade;
  onAddToList?: () => void;
}

export default function WordUpgradeCard({ upgrade, onAddToList }: WordUpgradeCardProps) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    onAddToList?.();
  };

  // Highlight the original word in the sentence
  const highlightWord = (sentence: string, word: string, highlightColor: string) => {
    const lowerSentence = sentence.toLowerCase();
    const lowerWord = word.toLowerCase();
    const idx = lowerSentence.indexOf(lowerWord);
    if (idx === -1) return <Text style={{ color: colors.foreground, fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 22 }}>{sentence}</Text>;

    return (
      <Text style={{ color: colors.foreground, fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 22 }}>
        {sentence.slice(0, idx)}
        <Text style={{ color: highlightColor, fontFamily: 'Inter_600SemiBold' }}>{sentence.slice(idx, idx + word.length)}</Text>
        {sentence.slice(idx + word.length)}
      </Text>
    );
  };

  return (
    <Pressable
      onPress={() => setExpanded(!expanded)}
      style={[
        styles.card,
        cardShadow,
        {
          backgroundColor: colors.card,
          borderRadius: colors.radius,
        },
      ]}
    >
      {/* Header row */}
      <View style={styles.header}>
        <View style={styles.wordRow}>
          <Text style={[styles.original, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
            {upgrade.original}
          </Text>
          <Feather name="arrow-right" size={14} color={colors.accent} style={styles.arrow} />
          <Text style={[styles.suggestion, { color: colors.accent, fontFamily: 'Inter_600SemiBold' }]}>
            {upgrade.suggestion}
          </Text>
        </View>
        <Feather
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={colors.mutedForeground}
        />
      </View>

      {expanded && (
        <View style={styles.expanded}>
          {/* Before */}
          <View style={[styles.sentenceBlock, { backgroundColor: colors.secondary, borderRadius: colors.radius / 2 }]}>
            <Text style={[styles.sentenceLabel, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
              You said
            </Text>
            {highlightWord(upgrade.originalSentence, upgrade.original, colors.coral)}
          </View>

          {/* After */}
          <View style={[styles.sentenceBlock, { backgroundColor: colors.secondary, borderRadius: colors.radius / 2, marginTop: 8 }]}>
            <Text style={[styles.sentenceLabel, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
              Try instead
            </Text>
            {highlightWord(upgrade.improvedSentence, upgrade.suggestion, colors.accent)}
          </View>

          {/* Add to word list */}
          {onAddToList && (
            <Pressable
              onPress={handleAdd}
              disabled={added}
              style={({ pressed }) => [
                styles.addButton,
                { opacity: pressed || added ? 0.6 : 1 },
              ]}
            >
              <Feather name={added ? 'check' : 'plus'} size={14} color={colors.accent} />
              <Text style={[styles.addText, { color: colors.accent, fontFamily: 'Inter_500Medium' }]}>
                {added ? 'Added to word list' : 'Add to practice list'}
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  original: {
    fontSize: 15,
    textDecorationLine: 'line-through',
  },
  arrow: {
    marginHorizontal: 2,
  },
  suggestion: {
    fontSize: 15,
  },
  expanded: {
    marginTop: 14,
  },
  sentenceBlock: {
    padding: 12,
  },
  sentenceLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  addText: {
    fontSize: 13,
  },
});
