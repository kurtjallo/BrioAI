import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useColors } from '@/hooks/useColors';

// Fixed bar heights (relative) — defines the shape of the waveform
const BAR_HEIGHTS = [0.3, 0.55, 0.8, 0.5, 1.0, 0.65, 0.4, 0.9, 0.6, 0.75, 0.35, 0.85, 0.5, 0.7, 0.4];
const BAR_DURATIONS = [900, 750, 1100, 830, 970, 1050, 880, 720, 1000, 850, 930, 780, 1020, 870, 950];

// Each bar is a separate component to satisfy hook rules
function WaveBar({ baseHeight, duration, active, color }: {
  baseHeight: number;
  duration: number;
  active: boolean;
  color: string;
}) {
  const anim = useSharedValue(0);

  useEffect(() => {
    if (active) {
      anim.value = withRepeat(
        withTiming(1, { duration, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      );
    } else {
      anim.value = withTiming(0, { duration: 400 });
    }
  }, [active, duration, anim]);

  const style = useAnimatedStyle(() => {
    const minH = 4;
    const maxH = 48;
    const h = active
      ? minH + (maxH - minH) * (0.3 + 0.7 * anim.value) * baseHeight
      : minH + (maxH - minH) * 0.2 * baseHeight;
    return { height: h };
  });

  return (
    <Animated.View
      style={[
        { width: 3, borderRadius: 2, backgroundColor: color, marginHorizontal: 2 },
        style,
      ]}
    />
  );
}

interface WaveformVisualizerProps {
  active: boolean;
}

export default function WaveformVisualizer({ active }: WaveformVisualizerProps) {
  const colors = useColors();
  const color = active ? colors.accent : colors.mutedForeground;

  return (
    <View style={styles.container}>
      {BAR_HEIGHTS.map((h, i) => (
        <WaveBar
          key={i}
          baseHeight={h}
          duration={BAR_DURATIONS[i] ?? 900}
          active={active}
          color={color}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
  },
});
