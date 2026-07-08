import React, { useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText, Badge, EmptyState } from "../src/components/ui";
import {
  TransactionItem,
  useTransactionHistory,
} from "../src/hooks/useProtocolData";
import { useTheme } from "../src/theme/ThemeContext";
import { radius, spacing } from "../src/theme/theme";

const FILTERS = ["all", "send", "receive", "swap"] as const;
type Filter = (typeof FILTERS)[number];

const typeIcon: Record<TransactionItem["type"], string> = {
  send: "\u2191",
  receive: "\u2193",
  swap: "\u21C4",
};

const TransactionRow = ({ tx }: { tx: TransactionItem }) => {
  const { theme } = useTheme();
  const statusTone =
    tx.status === "confirmed"
      ? "success"
      : tx.status === "pending"
        ? "warning"
        : "error";
  const iconColor =
    tx.type === "receive"
      ? theme.colors.success
      : tx.type === "swap"
        ? theme.colors.secondary
        : theme.colors.primary;
  return (
    <View
      style={[
        styles.txRow,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
      testID={`tx-${tx.id}`}
    >
      <View style={[styles.txIcon, { backgroundColor: iconColor + "22" }]}>
        <Text style={{ color: iconColor, fontSize: 18, fontWeight: "700" }}>
          {typeIcon[tx.type]}
        </Text>
      </View>
      <View style={styles.txMain}>
        <Text style={[styles.txType, { color: iconColor }]}>
          {tx.type.toUpperCase()}
        </Text>
        <AppText variant="bodyStrong">
          {tx.amount} {tx.asset}
        </AppText>
        <AppText variant="caption" color="muted">
          {tx.network} {"\u2022"}{" "}
          {new Date(tx.timestamp * 1000).toLocaleDateString()}
        </AppText>
      </View>
      <View style={styles.txSide}>
        <AppText variant="bodyStrong">{tx.value}</AppText>
        <View style={{ marginTop: 4 }}>
          <Badge label={tx.status} tone={statusTone} />
        </View>
      </View>
    </View>
  );
};

export default function TransactionsScreen() {
  const { transactions, loading, refreshTransactions } =
    useTransactionHistory();
  const { theme } = useTheme();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return transactions.filter((tx) => {
      if (filter !== "all" && tx.type !== filter) return false;
      if (!term) return true;
      return (
        tx.asset.toLowerCase().includes(term) ||
        tx.hash.toLowerCase().includes(term) ||
        tx.network.toLowerCase().includes(term)
      );
    });
  }, [transactions, search, filter]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["bottom"]}
    >
      <View style={styles.inner}>
        <View
          style={[
            styles.search,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Text
            style={{ color: theme.colors.textMuted, marginRight: spacing.sm }}
          >
            {"\uD83D\uDD0D"}
          </Text>
          <TextInput
            style={{ flex: 1, color: theme.colors.textPrimary, fontSize: 15 }}
            placeholder="Search by asset, hash, or network"
            placeholderTextColor={theme.colors.textMuted}
            value={search}
            onChangeText={setSearch}
            accessibilityLabel="Search transactions"
          />
        </View>

        <View style={styles.filterRow}>
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: active
                      ? theme.colors.primary
                      : theme.colors.surfaceLight,
                    borderColor: active
                      ? theme.colors.primary
                      : theme.colors.border,
                  },
                ]}
                onPress={() => setFilter(f)}
                accessibilityRole="button"
                accessibilityLabel={`Filter ${f}`}
              >
                <Text
                  style={{
                    color: active ? "#fff" : theme.colors.textSecondary,
                    fontWeight: active ? "700" : "500",
                    textTransform: "capitalize",
                    fontSize: 13,
                  }}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionRow tx={item} />}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refreshTransactions}
              tintColor={theme.colors.primary}
            />
          }
          ListEmptyComponent={
            <EmptyState
              title="No transactions found"
              subtitle="No transactions match your current filters."
            />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, padding: spacing.lg },
  search: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    marginBottom: spacing.md,
  },
  filterRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 7,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  listContent: { paddingBottom: spacing.xxl },
  txRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  txMain: { flex: 1 },
  txType: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  txSide: { alignItems: "flex-end", justifyContent: "center" },
});
