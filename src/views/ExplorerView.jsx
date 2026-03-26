import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

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
      >
        <Text style={styles.filterChipText}>{formatFilterLabel(filterName)}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Exercises</Text>

      <TextInput
        value={searchQuery}
        onChangeText={onSearch}
        placeholder="Search exercise"
        style={styles.searchInput}
      />

      <Text style={styles.sectionTitle}>Filters</Text>
      <View style={styles.filterRow}>{filters.map(renderFilterChip)}</View>

      <View style={styles.resultsContainer}>{resultsContent}</View>

      <View style={styles.bottomBar}>
        <Text style={styles.bottomTitle}>Custom Plan: {customPlanCount}</Text>
        <TouchableOpacity style={styles.viewButton} onPress={onViewPlan}>
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
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 16,
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
    borderColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  filterChipActive: {
    backgroundColor: "#eee",
  },
  filterChipText: {
    fontSize: 14,
  },
  resultsContainer: {
    flex: 1,
  },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 12,
    marginTop: 8,
  },
  bottomTitle: {
    marginBottom: 8,
  },
  viewButton: {
    borderWidth: 1,
    borderColor: "#999",
    padding: 10,
    alignItems: "center",
  },
  viewButtonText: {
    fontSize: 14,
  },
});
