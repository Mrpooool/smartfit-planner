import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { colors, radius, shadow } from "../theme";
import { AddToPlanModal } from "./AddToPlanModal";

export function ExplorerView({
  searchQuery,
  filters,
  activeFilter,
  showAnimatedListImages,
  onSearch,
  onFilterChange,
  onImageModeChange,
  resultsContent,
  // Modal props
  modalVisible,
  selectedExercise,
  savedPlans,
  onSelectPlan,
  onCreateNewPlan,
  onCloseModal,
}) {
  function renderFilterChip(filterName) {
    var selected = filterName === activeFilter;

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

  function renderImageModeButton(useAnimatedImages, label, hint) {
    const selected = Boolean(showAnimatedListImages) === useAnimatedImages;

    function handlePress() {
      if (onImageModeChange) {
        onImageModeChange(useAnimatedImages);
      }
    }

    return (
      <TouchableOpacity
        style={[styles.imageModeButton, selected && styles.imageModeButtonActive]}
        onPress={handlePress}
      >
        <Text style={[styles.imageModeLabel, selected && styles.imageModeLabelActive]}>
          {label}
        </Text>
        <Text style={[styles.imageModeHint, selected && styles.imageModeHintActive]}>
          {hint}
        </Text>
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

      <Text style={styles.sectionTitle}>List Display</Text>
      <View style={styles.imageModeRow}>
        {renderImageModeButton(
          false,
          "Data Saver",
          "Use lightweight previews to save mobile data and run more smoothly on lower-end phones"
        )}
        {renderImageModeButton(
          true,
          "Motion Preview",
          "Show animated thumbnails for the richest browsing experience when network conditions are good"
        )}
      </View>

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
  imageModeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  imageModeButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  imageModeButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  imageModeLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  imageModeLabelActive: {
    color: colors.primaryDark,
  },
  imageModeHint: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  imageModeHintActive: {
    color: colors.primaryDark,
  },
  resultsContainer: {
    flex: 1,
  },

});
