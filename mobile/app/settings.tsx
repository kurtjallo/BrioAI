import React, { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useTheme, type ThemeMode } from '@/contexts/ThemeContext';
import { cardShadow } from '@/constants/colors';
import { useSession } from '@/contexts/SessionContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { formatTimeLabel, getNotificationTime, setNotificationTime } from '@/services/preferences';
import { scheduleDailyReminder } from '@/services/notifications';
import ClinicalNote from '@/components/ClinicalNote';

const TIME_OPTIONS = ['07:30', '08:30', '12:30', '17:30', '19:00', '21:00'];

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: React.ComponentProps<typeof Feather>['name'] }[] = [
  { value: 'light', label: 'Light', icon: 'sun' },
  { value: 'dark', label: 'Dark', icon: 'moon' },
  { value: 'system', label: 'System', icon: 'smartphone' },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { seedSampleData, clearAllSessions } = useSession();
  const { resetOnboarding } = useOnboarding();
  const { mode, setMode } = useTheme();
  const [notifyTime, setNotifyTime] = useState<string | null>(null);

  useEffect(() => {
    getNotificationTime().then(setNotifyTime);
  }, []);

  const pickTime = async (t: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotifyTime(t);
    await setNotificationTime(t);
    await scheduleDailyReminder(t);
  };

  const confirm = (title: string, message: string, action: () => void | Promise<void>) => {
    if (Platform.OS === 'web') {
      action();
      return;
    }
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Continue', style: 'destructive', onPress: () => action() },
    ]);
  };

  const topPad = Platform.OS === 'web' ? 30 : Math.max(insets.top, 16);
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: topPad + 8, paddingBottom: botPad + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Text style={[styles.heading, { color: colors.foreground, fontFamily: 'Fraunces_600SemiBold' }]}>
            Settings
          </Text>
          <Pressable onPress={() => router.back()} style={[styles.closeBtn, cardShadow, { backgroundColor: colors.card }]}>
            <Feather name="x" size={18} color={colors.mutedForeground} />
          </Pressable>
        </View>

        {/* Notification time */}
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
          Daily reminder
        </Text>
        <View style={[styles.card, cardShadow, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <Text style={[styles.cardHint, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
            {notifyTime
              ? `You'll be nudged around ${formatTimeLabel(notifyTime)} — when you said you're somewhere you can talk out loud.`
              : 'Pick a time when you\u2019re somewhere you can talk out loud.'}
          </Text>
          <View style={styles.timeRow}>
            {TIME_OPTIONS.map(t => {
              const selected = t === notifyTime;
              return (
                <Pressable
                  key={t}
                  onPress={() => pickTime(t)}
                  style={[
                    styles.timeChip,
                    { backgroundColor: selected ? colors.primary : colors.secondary, borderRadius: 20 },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      color: selected ? colors.primaryForeground : colors.foreground,
                      fontFamily: selected ? 'Inter_600SemiBold' : 'Inter_400Regular',
                    }}
                  >
                    {formatTimeLabel(t)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Appearance */}
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium', marginTop: 28 }]}>
          Appearance
        </Text>
        <View style={[styles.card, cardShadow, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <View style={styles.themeRow}>
            {THEME_OPTIONS.map(opt => {
              const selected = opt.value === mode;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setMode(opt.value);
                  }}
                  style={[
                    styles.themeChip,
                    { backgroundColor: selected ? colors.primary : colors.secondary, borderRadius: 20 },
                  ]}
                >
                  <Feather
                    name={opt.icon}
                    size={14}
                    color={selected ? colors.primaryForeground : colors.foreground}
                  />
                  <Text
                    style={{
                      fontSize: 13,
                      color: selected ? colors.primaryForeground : colors.foreground,
                      fontFamily: selected ? 'Inter_600SemiBold' : 'Inter_400Regular',
                    }}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Account */}
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium', marginTop: 28 }]}>
          Account
        </Text>
        <View style={[styles.card, cardShadow, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <Row icon="user" label="Create an account" hint="Coming soon" colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Row icon="trash-2" label="Delete my data" hint="Coming soon" colors={colors} />
        </View>

        {/* Preview & sample data */}
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium', marginTop: 28 }]}>
          Preview
        </Text>
        <View style={[styles.card, cardShadow, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <Row
            icon="database"
            label="Load sample data"
            hint="15 realistic sessions"
            colors={colors}
            onPress={() =>
              confirm('Load sample data?', 'This replaces your current sessions with sample history.', async () => {
                await seedSampleData();
                router.back();
              })
            }
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Row
            icon="x-circle"
            label="Clear all sessions"
            colors={colors}
            onPress={() =>
              confirm('Clear all sessions?', 'This removes every session on this device.', async () => {
                await clearAllSessions();
                router.back();
              })
            }
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Row
            icon="mic-off"
            label="Preview permission-denied screen"
            colors={colors}
            onPress={() => router.push({ pathname: '/recording', params: { mockDenied: '1', prompt: '' } })}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Row
            icon="refresh-ccw"
            label="Replay onboarding"
            colors={colors}
            onPress={async () => {
              await resetOnboarding();
              router.replace('/onboarding');
            }}
          />
        </View>

        <ClinicalNote />
      </ScrollView>
    </View>
  );
}

function Row({ icon, label, hint, colors, onPress }: {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  hint?: string;
  colors: ReturnType<typeof useColors>;
  onPress?: () => void;
}) {
  const disabled = !onPress;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.row, { opacity: pressed ? 0.6 : 1 }]}
    >
      <Feather name={icon} size={17} color={disabled ? colors.mutedForeground : colors.foreground} />
      <Text
        style={[
          styles.rowLabel,
          { color: disabled ? colors.mutedForeground : colors.foreground, fontFamily: 'Inter_500Medium' },
        ]}
      >
        {label}
      </Text>
      {hint ? (
        <Text style={[styles.rowHint, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
          {hint}
        </Text>
      ) : (
        !disabled && <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  heading: { fontSize: 26 },
  closeBtn: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  sectionLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
  card: { paddingHorizontal: 18, paddingVertical: 6 },
  cardHint: { fontSize: 13, lineHeight: 20, marginTop: 12, marginBottom: 12 },
  timeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingBottom: 14 },
  timeChip: { paddingVertical: 8, paddingHorizontal: 12 },
  themeRow: { flexDirection: 'row', gap: 8, paddingVertical: 14 },
  themeChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 15 },
  rowLabel: { fontSize: 15, flex: 1 },
  rowHint: { fontSize: 12 },
  divider: { height: StyleSheet.hairlineWidth },
});
