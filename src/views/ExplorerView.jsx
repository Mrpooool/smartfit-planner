import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radius, shadow } from "../theme";
import { AddToPlanModal } from "./AddToPlanModal";

export function ExplorerView({
  searchQuery,
  filters,
  activeFilter,
  onSearch,
  onFilterChange,
  resultsContent,
  modalVisible,
  selectedExercise,
  savedPlans,
  onSelectPlan,
  onCreateNewPlan,
  onCloseModal,
}) {
  const insets = useSafeAreaInsets();

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
      >
        <Text style={[styles.filterChipText, selected && styles.filterChipTextActive]}>{formatFilterLabel(filterName)}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.title}>Explore Exercises</Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={colors.textTertiary} style={styles.searchIcon} />
        <TextInput
          value={searchQuery}
          onChangeText={onSearch}
          placeholder="Search exercise..."
          placeholderTextColor={colors.textTertiary}
          style={styles.searchInput}
        />
      </View>

      <Text style={styles.sectionTitle}>Filters</Text>
      <View style={styles.filterRow}>{filters.map(renderFilterChip)}</View>

      <View style={styles.resultsContainer}>{resultsContent}</View>

      <AddToPlanModal
        visible={modalVisible}
        exercise={selectedExercise}
        savedPlans={savedPlans || []}
        onSelectPlan={onSelectPlan}
        onCreateNewPlan={onCreateNewPlan}
        onClose={onCloseModal}
      />
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
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    marginBottom: 16,
    ...shadow.sm,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.textPrimary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  filterChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  filterChipText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  filterChipTextActive: {
    color: colors.primaryDark,
  },
  resultsContainer: {
    flex: 1,
  },
});
