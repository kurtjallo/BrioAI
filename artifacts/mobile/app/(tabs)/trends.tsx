import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { useColors } from '@/hooks/useColors';
import { cardShadow, type } from '@/constants/colors';
import { useSession } from '@/contexts/SessionContext';
import { Session } from '@/types';
import { Blob1 } from '@/components/Illustrations';

type MetricKey = 'lexicalDiversity' | 'vagueWordDensity' | 'fillerRate';

const METRICS: { key: MetricKey; label: string; format: (v: number) => string; better: 'higher' | 'lower' }[] = [
  { key: 'lexicalDiversity', label: 'Vocabulary diversity', format: v => `${Math.round(v * 100)}%`, better: 'higher' },
  { key: 'vagueWordDensity', label: 'Vague word density', format: v => `${Math.round(v * 100)}%`, better: 'lower' },
  { key: 'fillerRate', label: 'Filler rate', format: v => `${v.toFixed(1)} / 100w`, better: 'lower' },
];

function getValue(session: Session, key: MetricKey): number {
  const { vocabulary, delivery } = session.analysis;
  if (key === 'lexicalDiversity') return vocabulary.lexicalDiversity;
  if (key === 'vagueWordDensity') return vocabulary.vagueWordDensity;
  return delivery.fillerRate;
}

const CHART_HEIGHT = 160;
const CHART_PADDING = 24;

const TOOLTIP_WIDTH = 132;
const TOOLTIP_HEIGHT = 52;
const TOOLTIP_DISMISS_MS = 4000;

function formatSessionDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function LineChart({
  data,
  dates,
  color,
  baseline,
  formatValue,
  tooltipBackground,
  tooltipForeground,
}: {
  data: number[];
  dates: string[];
  color: string;
  baseline: { low: number; high: number } | null;
  formatValue: (v: number) => string;
  tooltipBackground: string;
  tooltipForeground: string;
}) {
  const screenWidth = Math.min(Dimensions.get('window').width - 48, 500);
  const chartW = screenWidth - CHART_PADDING * 2;
  const [selected, setSelected] = useState<number | null>(null);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset selection when data changes (metric/range switch)
  useEffect(() => {
    setSelected(null);
  }, [data.length, color]);

  useEffect(() => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    if (selected !== null) {
      dismissTimer.current = setTimeout(() => setSelected(null), TOOLTIP_DISMISS_MS);
    }
    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, [selected]);

  if (data.length < 2) {
    return (
      <View style={{ height: CHART_HEIGHT, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color, opacity: 0.4, fontSize: 14 }}>Not enough data yet</Text>
      </View>
    );
  }

  const allVals = baseline ? [...data, baseline.low, baseline.high] : data;
  const maxVal = Math.max(...allVals);
  const minVal = Math.min(...allVals);
  const range = maxVal === minVal ? 1 : maxVal - minVal;
  const pad = CHART_HEIGHT * 0.15;

  const yFor = (v: number) => pad + (1 - (v - minVal) / range) * (CHART_HEIGHT - pad * 2);

  const points = data.map((v, i) => ({
    x: CHART_PADDING + (i / (data.length - 1)) * chartW,
    y: yFor(v),
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

  const bandTop = baseline ? yFor(baseline.high) : 0;
  const bandBottom = baseline ? yFor(baseline.low) : 0;

  const handlePress = (locX: number, locY: number) => {
    // Find nearest point horizontally
    let nearest = 0;
    let nearestDist = Infinity;
    points.forEach((p, i) => {
      const d = Math.abs(p.x - locX);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = i;
      }
    });
    // Only select when tap is reasonably close to the point; otherwise dismiss
    const dy = Math.abs(points[nearest].y - locY);
    if (nearestDist <= 24 && dy <= 60) {
      setSelected(prev => (prev === nearest ? null : nearest));
    } else {
      setSelected(null);
    }
  };

  const sel = selected !== null && selected < points.length ? points[selected] : null;
  const tooltipLeft = sel
    ? Math.min(Math.max(sel.x - TOOLTIP_WIDTH / 2, 0), screenWidth - TOOLTIP_WIDTH)
    : 0;
  const tooltipAbove = sel ? sel.y - TOOLTIP_HEIGHT - 10 >= 0 : false;
  const tooltipTop = sel ? (tooltipAbove ? sel.y - TOOLTIP_HEIGHT - 10 : sel.y + 10) : 0;

  return (
    <View style={{ width: screenWidth, height: CHART_HEIGHT }}>
      <Pressable
        onPress={e => handlePress(e.nativeEvent.locationX, e.nativeEvent.locationY)}
        accessibilityLabel="Trend chart. Tap a point to see that session's date and value."
      >
        <Svg width={screenWidth} height={CHART_HEIGHT}>
          {baseline && (
            <Rect
              x={CHART_PADDING}
              y={bandTop}
              width={chartW}
              height={Math.max(bandBottom - bandTop, 2)}
              fill={color}
              opacity={0.12}
              rx={4}
            />
          )}
          <Path d={pathD} stroke={color} strokeWidth={3} fill="none" strokeLinejoin="round" strokeLinecap="round" />
          {points.map((p, i) => (
            <React.Fragment key={i}>
              {selected === i && <Circle cx={p.x} cy={p.y} r={9} fill={color} opacity={0.25} />}
              <Circle cx={p.x} cy={p.y} r={i === points.length - 1 ? 6 : 4} fill={color} />
            </React.Fragment>
          ))}
        </Svg>
      </Pressable>
      {sel && selected !== null && (
        <View
          pointerEvents="none"
          style={[
            styles.tooltip,
            cardShadow,
            {
              left: tooltipLeft,
              top: tooltipTop,
              backgroundColor: tooltipBackground,
              width: TOOLTIP_WIDTH,
              height: TOOLTIP_HEIGHT,
            },
          ]}
        >
          <Text style={{ color: tooltipForeground, fontFamily: type.semibold, fontSize: 13 }}>
            {formatValue(data[selected])}
          </Text>
          <Text style={{ color: tooltipForeground, fontFamily: type.body, fontSize: 11, opacity: 0.8 }}>
            {formatSessionDate(dates[selected])}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function TrendsScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { sessions, loading, error, reload } = useSession();
  const [activeMetric, setActiveMetric] = useState<MetricKey>('lexicalDiversity');
  const [rangeDays, setRangeDays] = useState<30 | 90>(30);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const metric = METRICS.find(m => m.key === activeMetric)!;
  const cutoff = Date.now() - rangeDays * 24 * 60 * 60 * 1000;
  const inRange = sessions.filter(s => new Date(s.date).getTime() >= cutoff).reverse();
  const data = inRange.map(s => getValue(s, activeMetric));

  // Baseline band: first-week average ± one standard deviation, once 7+ sessions exist
  const baseline = React.useMemo(() => {
    if (sessions.length < 7) return null;
    const chronological = [...sessions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const firstDate = new Date(chronological[0].date).getTime();
    const weekEnd = firstDate + 7 * 24 * 60 * 60 * 1000;
    let firstWeek = chronological.filter(s => new Date(s.date).getTime() <= weekEnd);
    if (firstWeek.length < 2) firstWeek = chronological.slice(0, 7);
    const vals = firstWeek.map(s => getValue(s, activeMetric));
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const sd = Math.sqrt(vals.reduce((a, v) => a + (v - mean) ** 2, 0) / vals.length);
    return { low: mean - sd, high: mean + sd };
  }, [sessions, activeMetric]);

  const latestValue = data.length > 0 ? data[data.length - 1] : null;
  const previousValue = data.length > 1 ? data[data.length - 2] : null;
  const trending =
    previousValue !== null && latestValue !== null
      ? latestValue > previousValue
        ? 'up'
        : latestValue < previousValue
          ? 'down'
          : 'flat'
      : null;

  const trendIsPositive =
    trending === 'up' && metric.better === 'higher'
      ? true
      : trending === 'down' && metric.better === 'lower'
        ? true
        : false;

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: topPad + 12, paddingBottom: botPad + 80 }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.heading, { color: colors.foreground, fontFamily: type.displayBold }]}>
        Trends
      </Text>

      {loading ? (
        <>
          <View style={{ height: 50, borderRadius: 26, backgroundColor: colors.muted, opacity: 0.4, marginBottom: 24 }} />
          <View style={{ height: 200, borderRadius: colors.radius, backgroundColor: colors.muted, opacity: 0.3 }} />
        </>
      ) : error ? (
        <View style={[styles.empty, { borderColor: colors.border, borderRadius: colors.radius }]}>
          <Text style={[styles.emptyTitle, { color: colors.foreground, fontFamily: type.semibold }]}>
            Couldn&apos;t load your sessions
          </Text>
          <Text style={[styles.emptyHint, { color: colors.mutedForeground, fontFamily: type.body }]}>
            {error}
          </Text>
          <Pressable
            onPress={reload}
            style={({ pressed }) => [{ marginTop: 12, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 36, backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
          >
            <Text style={{ color: colors.primaryForeground, fontFamily: type.semibold, fontSize: 15 }}>Try again</Text>
          </Pressable>
        </View>
      ) : sessions.length < 2 ? (
        <>
          {sessions.length === 1 && (
            <View style={[styles.chartContainer, cardShadow, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
              <Text style={[styles.chartLabel, { color: colors.mutedForeground, fontFamily: type.semibold }]}>
                Your first session
              </Text>
              <View style={styles.firstSessionRow}>
                <View style={styles.firstMetric}>
                  <Text style={[styles.latestValue, { color: colors.foreground, fontFamily: type.bold, fontSize: 32 }]}>
                    {Math.round(sessions[0].analysis.vocabulary.lexicalDiversity * 100)}%
                  </Text>
                  <Text style={[styles.emptyHint, { color: colors.mutedForeground, fontFamily: type.body, fontSize: 13 }]}>
                    Vocabulary diversity
                  </Text>
                </View>
                <View style={styles.firstMetric}>
                  <Text style={[styles.latestValue, { color: colors.foreground, fontFamily: type.bold, fontSize: 32 }]}>
                    {sessions[0].analysis.delivery.fillerRate.toFixed(1)}
                  </Text>
                  <Text style={[styles.emptyHint, { color: colors.mutedForeground, fontFamily: type.body, fontSize: 13 }]}>
                    Fillers / 100 words
                  </Text>
                </View>
              </View>
            </View>
          )}
          {sessions.length === 0 && (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Blob1 color={colors.softBlue} size={150} style={{ marginBottom: 20 }} />
              <Text style={[styles.emptyHint, { color: colors.foreground, fontFamily: type.body, fontSize: 16, textAlign: 'center', paddingHorizontal: 20 }]}>
                Each session adds a point to your trend line. Record more to start seeing vocabulary and filler trends.
              </Text>
            </View>
          )}
          <Text style={[styles.note, { color: colors.mutedForeground, fontFamily: type.body, marginTop: 32 }]}>
            Comparisons against your baseline unlock after a week of sessions.
          </Text>
        </>
      ) : (
        <>
          {/* Metric selector */}
          <View style={[styles.selector, { backgroundColor: colors.muted, borderRadius: 30 }]}>
            {METRICS.map(m => (
              <Pressable
                key={m.key}
                onPress={() => setActiveMetric(m.key)}
                style={[
                  styles.selectorTab,
                  activeMetric === m.key && [cardShadow, { backgroundColor: colors.card, borderRadius: 26 }],
                ]}
              >
                <Text
                  style={[
                    styles.selectorTabText,
                    {
                      color: activeMetric === m.key ? colors.foreground : colors.mutedForeground,
                      fontFamily: activeMetric === m.key ? type.semibold : type.body,
                    },
                  ]}
                  numberOfLines={2}
                >
                  {m.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Latest value */}
          {latestValue !== null && (
            <View style={styles.latestRow}>
              <Text style={[styles.latestValue, { color: colors.foreground, fontFamily: type.bold }]}>
                {metric.format(latestValue)}
              </Text>
              {trending && trending !== 'flat' && (
                <Text
                  style={[
                    styles.trendArrow,
                    { color: trendIsPositive ? colors.green : colors.orange, fontFamily: type.semibold },
                  ]}
                >
                  {trending === 'up' ? '↑' : '↓'}
                </Text>
              )}
            </View>
          )}

          {/* Chart */}
          <View style={[styles.chartContainer, cardShadow, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
            <View style={styles.chartHeader}>
              <Text style={[styles.chartLabel, { color: colors.mutedForeground, fontFamily: type.medium }]}>
                {inRange.length} session{inRange.length === 1 ? '' : 's'} · last {rangeDays} days
              </Text>
              <View style={[styles.rangeToggle, { backgroundColor: colors.muted, borderRadius: 14 }]}>
                {([30, 90] as const).map(d => (
                  <Pressable
                    key={d}
                    onPress={() => setRangeDays(d)}
                    style={[
                      styles.rangeTab,
                      rangeDays === d && { backgroundColor: colors.card, borderRadius: 11 },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: rangeDays === d ? colors.foreground : colors.mutedForeground,
                        fontFamily: rangeDays === d ? type.semibold : type.body,
                      }}
                    >
                      {d}d
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <LineChart
              data={data}
              dates={inRange.map(s => s.date)}
              color={activeMetric === 'fillerRate' ? colors.pink : colors.accent}
              baseline={baseline}
              formatValue={metric.format}
              tooltipBackground={colors.foreground}
              tooltipForeground={colors.background}
            />
            {baseline && data.length >= 2 && (
              <Text style={[styles.note, { color: colors.mutedForeground, fontFamily: type.body, marginTop: 12, textAlign: 'left' }]}>
                Shaded band shows your first-week baseline range.
              </Text>
            )}
          </View>

          {/* Session count note */}
          {sessions.length < 7 && (
            <Text style={[styles.note, { color: colors.mutedForeground, fontFamily: type.body, marginTop: 16 }]}>
              Comparisons against your baseline unlock after a week of sessions.
            </Text>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 24 },
  heading: { fontSize: 36, marginBottom: 28 },
  empty: { borderWidth: 1, borderStyle: 'dashed', padding: 40, alignItems: 'center', gap: 12 },
  emptyTitle: { fontSize: 18 },
  emptyHint: { fontSize: 15, textAlign: 'center', lineHeight: 24 },
  selector: { padding: 4, flexDirection: 'row', gap: 4, marginBottom: 32 },
  selectorTab: { flex: 1, paddingVertical: 12, paddingHorizontal: 6, alignItems: 'center' },
  selectorTabText: { fontSize: 12, textAlign: 'center' },
  latestRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 20 },
  latestValue: { fontSize: 44 },
  trendArrow: { fontSize: 28 },
  chartContainer: { padding: 24, marginBottom: 20 },
  chartHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  chartLabel: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, flexShrink: 1 },
  rangeToggle: { flexDirection: 'row', padding: 2, gap: 2 },
  rangeTab: { paddingHorizontal: 10, paddingVertical: 5 },
  note: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  firstSessionRow: { flexDirection: 'row', gap: 24 },
  firstMetric: { flex: 1, gap: 6 },
  tooltip: {
    position: 'absolute',
    borderRadius: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
    gap: 2,
  },
});
