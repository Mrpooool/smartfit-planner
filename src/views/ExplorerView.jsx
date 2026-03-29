import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, shadow } from "../theme";

export function ExplorerView({
  searchQuery,
  filters,
  activeFilter,
  customPlanCount,
  onSearch,
  onFilterChange,
  onViewPlan,
  resultsContent,
}) {
  function renderFilterChip(filterName) {
    const selected = filterName === activeFilter;

    function handleFilterPress() {
      if (onFilterChange) {
        onFilterChange(filterName);
      }
    }

    return (
      <TouchableOpacity
        key={filterName}
        style={[styles.filterChip, selected && styles.filterChipActive]}
        onPress={handleFilterPress}
        activeOpacity={0.7}
      >
        <Text style={[styles.filterChipText, selected && styles.filterChipTextActive]}>
          {formatFilterLabel(filterName)}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Exercises</Text>

      <View style={styles.searchWrapper}>
        <Ionicons name="search-outline" size={18} color={colors.textTertiary} style={styles.searchIcon} />
        <TextInput
          value={searchQuery}
          onChangeText={onSearch}
          placeholder="Search exercise"
          placeholderTextColor={colors.textTertiary}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.filterRow}>{filters.map(renderFilterChip)}</View>

      <View style={styles.resultsContainer}>{resultsContent}</View>

      <View style={styles.bottomBar}>
        <Text style={styles.bottomTitle}>
          <Text style={styles.bottomCount}>{customPlanCount}</Text> exercises selected
        </Text>
        <TouchableOpacity style={styles.viewButton} onPress={onViewPlan} activeOpacity={0.8}>
          <Text style={styles.viewButtonText}>View / Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function formatFilterLabel(filterName) {
  if (filterName === "all") {
    return "All";
  }
  if (filterName === "upper legs") {
    return "Legs";
  }
  if (!filterName) {
    return "";
  }
  return filterName;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 16,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    marginBottom: 12,
    ...shadow.sm,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.textPrimary,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
    gap: 8,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: colors.textDark,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  filterChipTextActive: {
    color: colors.card,
    fontWeight: "600",
  },
  resultsContainer: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    marginTop: 8,
  },
  bottomTitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  bottomCount: {
    fontWeight: "700",
    color: colors.primary,
  },
  viewButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radius.sm,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.card,
  },
});
