import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { radius, spacing } from "../theme/theme";

// Column sparkline built from plain Views (no native SVG dependency).
export const Sparkline = ({
  data,
  height = 56,
  color,
}: {
  data: number[];
  height?: number;
  color?: string;
}) => {
  const { theme } = useTheme();
  const c = color ?? theme.colors.secondary;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  return (
    <View style={[styles.sparkRow, { height }]}>
      {data.map((v, i) => {
        const h = 8 + ((v - min) / range) * (height - 8);
        return (
          <View
            key={i}
            style={{
              flex: 1,
              marginHorizontal: 2,
              height: h,
              borderRadius: 4,
              backgroundColor: i === data.length - 1 ? c : c + "66",
            }}
          />
        );
      })}
    </View>
  );
};

// Thin horizontal progress bar.
export const ProgressBar = ({
  value,
  color,
  track,
}: {
  value: number; // 0..100
  color?: string;
  track?: string;
}) => {
  const { theme } = useTheme();
  return (
    <View
      style={{
        height: 8,
        borderRadius: radius.pill,
        backgroundColor: track ?? theme.colors.surfaceLight,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
          height: "100%",
          borderRadius: radius.pill,
          backgroundColor: color ?? theme.colors.primary,
        }}
      />
    </View>
  );
};

interface AllocSlice {
  label: string;
  value: number;
  color: string;
}

// Stacked allocation bar + legend, a compact alternative to a pie chart.
export const AllocationBar = ({ slices }: { slices: AllocSlice[] }) => {
  const { theme } = useTheme();
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <View>
      <View style={styles.stack}>
        {slices.map((s) => (
          <View
            key={s.label}
            style={{
              flex: s.value / total,
              backgroundColor: s.color,
            }}
          />
        ))}
      </View>
      <View style={styles.legend}>
        {slices.map((s) => (
          <View key={s.label} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: s.color }]} />
            <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>
              {s.label} {Math.round((s.value / total) * 100)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// Circular-style risk score indicator (ring + centered number).
export const RiskRing = ({
  score,
  size = 120,
}: {
  score: number; // 0..100, lower = safer
  size?: number;
}) => {
  const { theme } = useTheme();
  const tone =
    score < 35
      ? theme.colors.success
      : score < 65
        ? theme.colors.warning
        : theme.colors.error;
  const label = score < 35 ? "Low risk" : score < 65 ? "Moderate" : "High risk";
  return (
    <View style={{ alignItems: "center" }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 10,
          borderColor: tone,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.surface,
        }}
      >
        <Text
          style={{
            color: theme.colors.textPrimary,
            fontSize: size * 0.28,
            fontWeight: "800",
          }}
        >
          {score}
        </Text>
        <Text style={{ color: theme.colors.textMuted, fontSize: 11 }}>
          / 100
        </Text>
      </View>
      <Text style={{ color: tone, fontWeight: "700", marginTop: spacing.sm }}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  sparkRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  stack: {
    flexDirection: "row",
    height: 14,
    borderRadius: radius.pill,
    overflow: "hidden",
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: spacing.md,
    gap: spacing.md,
  },
  legendItem: { flexDirection: "row", alignItems: "center" },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
});
