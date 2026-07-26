import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { type } from '@/constants/colors';

/**
 * PRD §11: "No clinical framing. Training tool, not therapy or speech-language
 * pathology. Include a line directing users with persistent word-finding
 * difficulty to a qualified professional — sudden-onset difficulty can indicate
 * a medical issue."
 *
 * Deliberately quiet. It sits below the fold as a footnote, not a banner: the
 * screen above it has just told someone their point landed late, and an alarming
 * callout at that moment would read as a diagnosis. A hairline rule and muted
 * text carry the same information without the alarm.
 *
 * One component, two mount points (results + settings), so the wording can never
 * drift between them.
 */
export default function ClinicalNote({ style }: { style?: object }) {
  const colors = useColors();

  return (
    <View style={[styles.wrap, style]}>
      <View style={[styles.rule, { backgroundColor: colors.border }]} />
      <Text style={[styles.text, { color: colors.mutedForeground, fontFamily: type.body }]}>
        Cadence is a practice tool, not a clinical one. If reaching for words has
        become persistently harder — especially if it started suddenly — that is
        worth raising with a doctor or a speech-language therapist.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 36, gap: 16 },
  rule: { height: StyleSheet.hairlineWidth, width: '100%' },
  text: { fontSize: 13, lineHeight: 20 },
});
