import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useColors } from '@/hooks/useColors';
import { floatShadow } from '@/constants/colors';

interface RecordButtonProps {
  recording: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export default function RecordButton({ recording, onPress, disabled }: RecordButtonProps) {
  const colors = useColors();
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (recording) {
      pulse.value = withRepeat(
        withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      );
    } else {
      pulse.value = withTiming(0, { duration: 300 });
    }
  }, [recording, pulse]);

  const ring1Style = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0, 0.25]),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 1.55]) }],
  }));

  const ring2Style = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0, 0.15]),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 1.9]) }],
  }));

  const accentColor = recording ? colors.destructive : colors.accent;

  return (
    <View style={styles.container}>
      {/* Pulse rings */}
      <Animated.View
        style={[
          styles.ring,
          { width: 120, height: 120, borderRadius: 60, backgroundColor: accentColor },
          ring1Style,
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          { width: 120, height: 120, borderRadius: 60, backgroundColor: accentColor },
          ring2Style,
        ]}
      />

      {/* Main button */}
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.button,
          floatShadow,
          { backgroundColor: accentColor, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        {/* Inner indicator */}
        <View
          style={[
            recording ? styles.stopShape : styles.micShape,
            { backgroundColor: colors.primaryForeground },
          ]}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
  },
  button: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micShape: {
    width: 14,
    height: 22,
    borderRadius: 7,
  },
  stopShape: {
    width: 22,
    height: 22,
    borderRadius: 4,
  },
});
