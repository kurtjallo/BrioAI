import React from 'react';
import { FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useSession } from '@/contexts/SessionContext';
import SessionCard from '@/components/SessionCard';
import { Session } from '@/types';
import { type } from '@/constants/colors';
import { Squiggle } from '@/components/Illustrations';

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { sessions, loading, error, reload } = useSession();

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  if (loading) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: topPad + 12, paddingHorizontal: 20 }]}>
        <Text style={[styles.heading, { color: colors.foreground, fontFamily: type.displayBold }]}>History</Text>
        {[0, 1, 2].map(i => (
          <View key={i} style={{ height: 100, borderRadius: colors.radius, backgroundColor: colors.muted, opacity: 0.4 - i * 0.1, marginTop: 12 }} />
        ))}
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 }]}>
        <Feather name="alert-circle" size={28} color={colors.destructive} />
        <Text style={[styles.emptyTitle, { color: colors.foreground, fontFamily: type.semibold, marginTop: 12 }]}>
          Couldn&apos;t load history
        </Text>
        <Text style={[styles.emptyHint, { color: colors.mutedForeground, fontFamily: type.body, marginTop: 6 }]}>
          {error}
        </Text>
        <Pressable
          onPress={reload}
          style={({ pressed }) => [{ marginTop: 24, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 36, backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
        >
          <Text style={{ color: colors.primaryForeground, fontFamily: type.semibold, fontSize: 15 }}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <FlatList<Session>
        data={sessions}
        keyExtractor={s => s.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: topPad + 12, paddingBottom: botPad + 80 },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Text style={[styles.heading, { color: colors.foreground, fontFamily: type.displayBold }]}>
                History
              </Text>
              {sessions.length > 0 && (
                <View style={[styles.countBadge, { backgroundColor: colors.softBlue }]}>
                  <Text style={[styles.countText, { color: colors.foreground, fontFamily: type.bold }]}>
                    {sessions.length}
                  </Text>
                </View>
              )}
            </View>
            <Squiggle color={colors.pink} size={60} style={{ marginTop: -10, marginBottom: 10, marginLeft: 5 }} />
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={[styles.emptyIconWrap, { backgroundColor: colors.purple }]}>
              <Feather name="mic" size={28} color="#FFFFFF" />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground, fontFamily: type.semibold }]}>
              Your sessions will live here
            </Text>
            <Text style={[styles.emptyHint, { color: colors.mutedForeground, fontFamily: type.body }]}>
              Each sixty-second take is saved with its transcript and analysis. Record today&apos;s prompt to start your archive.
            </Text>
          </View>
        }
        ListFooterComponent={
          sessions.length > 0 && sessions.length < 7 ? (
            <Text style={[styles.footerNote, { color: colors.mutedForeground, fontFamily: type.body }]}>
              Comparisons against your baseline unlock after a week of sessions.
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <SessionCard
            session={item}
            onPress={() => router.push(`/results/${item.id}`)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  listContent: { paddingHorizontal: 20 },
  header: { marginBottom: 16 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  heading: { fontSize: 36 },
  countBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  countText: { fontSize: 14 },
  empty: { alignItems: 'center', justifyContent: 'center', gap: 16, paddingTop: 80, paddingHorizontal: 40 },
  emptyIconWrap: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  emptyTitle: { fontSize: 20, textAlign: 'center' },
  emptyHint: { fontSize: 15, textAlign: 'center', lineHeight: 24 },
  footerNote: { fontSize: 13, textAlign: 'center', lineHeight: 20, marginTop: 24, opacity: 0.8 },
});
