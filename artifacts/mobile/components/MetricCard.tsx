import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { cardShadow } from '@/constants/colors';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  accent?: boolean;
  small?: boolean;
}

export default function MetricCard({ label, value, subtitle, accent, small }: MetricCardProps) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.card,
        cardShadow,
        {
          backgroundColor: colors.card,
          borderRadius: colors.radius,
        },
      ]}
    >
      <Text
        style={[
          styles.value,
          {
            color: accent ? colors.accent : colors.foreground,
            fontSize: small ? 20 : 28,
            fontFamily: 'Inter_700Bold',
          },
        ]}
      >
        {value}
      </Text>
      <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
        {label}
      </Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    flex: 1,
  },
  value: {
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
});
