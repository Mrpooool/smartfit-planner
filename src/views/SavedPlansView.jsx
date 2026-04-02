import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, radius } from "../theme";

export function SavedPlansView({ savedPlans, getThisWeekCount, onStartPlan, onDeletePlan }) {
  const [openPlanId, setOpenPlanId] = useState(null);

  function togglePlanACB(planId) {
    setOpenPlanId(function updateOpenIdCB(previousId) {
      return previousId === planId ? null : planId;
    });
  }

  function renderPlanCB({ item }) {
    const isOpen = openPlanId === item.id;
    const thisWeekCount = getThisWeekCount(item);

    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.header}
          onPress={function () {
            togglePlanACB(item.id);
          }}
        >
          <View>
            <Text style={styles.planName}>{item.name || "Untitled Plan"}</Text>
            <Text style={styles.planMeta}>
              {item.exercises ? item.exercises.length : 0} exercises
            </Text>
          </View>
          <Text style={styles.expandText}>{isOpen ? "▲" : "▼"}</Text>
        </TouchableOpacity>

        {isOpen ? (
          <View style={styles.dropdown}>
            <Text style={styles.weekText}>This week: {thisWeekCount} workouts</Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.startButton}
                onPress={function () {
                  onStartPlan(item);
                }}
              >
                <Text style={styles.buttonText}>START</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={function () {
                  onDeletePlan(item.id);
                }}
              >
                <Text style={styles.buttonText}>DELETE</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Plans</Text>

      {savedPlans.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No saved plans yet.</Text>
        </View>
      ) : (
        <FlatList
          data={savedPlans}
          renderItem={renderPlanCB}
          keyExtractor={function (item) {
            return String(item.id);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  emptyBox: {
    padding: 16,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  emptyText: {
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginBottom: 12,
    padding: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  planMeta: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  expandText: {
    fontSize: 16,
  },
  dropdown: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  weekText: {
    fontSize: 14,
    marginBottom: 12,
    color: colors.textDark,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.sm,
  },
  deleteButton: {
    backgroundColor: colors.error,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.sm,
  },
  buttonText: {
    color: colors.card,
    fontWeight: "bold",
  },
});