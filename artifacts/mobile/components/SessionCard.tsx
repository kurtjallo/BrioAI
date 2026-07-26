import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { cardShadow } from '@/constants/colors';
import { Session } from '@/types';
import { formatShortDate } from '@/utils/prompts';

interface SessionCardProps {
  session: Session;
  onPress: () => void;
}

export default function SessionCard({ session, onPress }: SessionCardProps) {
  const colors = useColors();

  const prompt = session.prompt.length > 70 ? session.prompt.slice(0, 70) + '...' : session.prompt;
  const instruction = session.analysis.instruction.length > 90
    ? session.analysis.instruction.slice(0, 90) + '...'
    : session.analysis.instruction;

  const diversity = Math.round(session.analysis.vocabulary.lexicalDiversity * 100);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        cardShadow,
        {
          backgroundColor: colors.card,
          borderRadius: colors.radius,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      {/* Date + duration */}
      <View style={styles.meta}>
        <Text style={[styles.date, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
          {formatShortDate(session.date)}
        </Text>
        <Text style={[styles.duration, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
          {Math.round(session.duration)}s
        </Text>
      </View>

      {/* Prompt */}
      <Text style={[styles.prompt, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}>
        {prompt}
      </Text>

      {/* Instruction excerpt */}
      <Text style={[styles.instruction, { color: colors.accent, fontFamily: 'Inter_400Regular' }]}>
        {instruction}
      </Text>

      {/* Bottom row */}
      <View style={styles.footer}>
        <View style={[styles.pill, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.pillText, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
            {diversity}% diversity
          </Text>
        </View>
        <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    marginBottom: 14,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  duration: {
    fontSize: 12,
  },
  prompt: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  instruction: {
    fontSize: 13,
    lineHeight: 19,
    fontStyle: 'italic',
    marginBottom: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  pillText: {
    fontSize: 11,
  },
});
