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
import {
  TransactionItem,
  useTransactionHistory,
} from "../src/hooks/useProtocolData";
import { colors } from "../src/theme/colors";

const FILTERS = ["all", "send", "receive", "swap"] as const;
type Filter = (typeof FILTERS)[number];

const statusColor = (status: TransactionItem["status"]) => {
  if (status === "confirmed") return colors.success;
  if (status === "pending") return colors.warning;
  return colors.error;
};

const TransactionRow = ({ tx }: { tx: TransactionItem }) => (
  <View style={styles.txRow} testID={`tx-${tx.id}`}>
    <View style={styles.txMain}>
      <Text style={styles.txType}>{tx.type.toUpperCase()}</Text>
      <Text style={styles.txAsset}>
        {tx.amount} {tx.asset}
      </Text>
      <Text style={styles.txMeta}>
        {tx.network} | {new Date(tx.timestamp * 1000).toLocaleDateString()}
      </Text>
    </View>
    <View style={styles.txSide}>
      <Text style={styles.txValue}>{tx.value}</Text>
      <Text style={[styles.txStatus, { color: statusColor(tx.status) }]}>
        {tx.status}
      </Text>
    </View>
  </View>
);

export default function TransactionsScreen() {
  const { transactions, loading, refreshTransactions } =
    useTransactionHistory();
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
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search by asset, hash, or network"
        placeholderTextColor={colors.textSecondary}
        value={search}
        onChangeText={setSearch}
        accessibilityLabel="Search transactions"
      />
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterActive]}
            onPress={() => setFilter(f)}
            accessibilityRole="button"
            accessibilityLabel={`Filter ${f}`}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.filterTextActive,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionRow tx={item} />}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshTransactions}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <Text style={styles.muted}>No transactions match your filters.</Text>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  search: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    color: colors.textPrimary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  filterRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.surfaceLight,
  },
  filterActive: { backgroundColor: colors.primary },
  filterText: { color: colors.textSecondary, textTransform: "capitalize" },
  filterTextActive: { color: "#fff", fontWeight: "600" },
  listContent: { paddingBottom: 30 },
  txRow: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  txMain: { flex: 1 },
  txType: { color: colors.primary, fontSize: 11, fontWeight: "700" },
  txAsset: { color: colors.textPrimary, fontSize: 15, fontWeight: "600" },
  txMeta: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  txSide: { alignItems: "flex-end", justifyContent: "center" },
  txValue: { color: colors.textPrimary, fontWeight: "600" },
  txStatus: { fontSize: 12, marginTop: 2, textTransform: "capitalize" },
  muted: { color: colors.textSecondary, textAlign: "center", marginTop: 30 },
});
