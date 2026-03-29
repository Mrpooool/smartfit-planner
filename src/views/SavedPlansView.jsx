import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
          <Text style={styles.emptyText}>还没有保存的计划。</Text>
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
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
  },
  emptyText: {
    color: "#6b7280",
  },
  card: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
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
    color: "#6b7280",
  },
  expandText: {
    fontSize: 16,
  },
  dropdown: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#d1d5db",
  },
  weekText: {
    fontSize: 14,
    marginBottom: 12,
    color: "#374151",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  startButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});