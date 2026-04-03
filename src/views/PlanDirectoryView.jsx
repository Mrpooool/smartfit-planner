import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, shadow } from "../theme";

/**
 * Directory page for the Plan tab — lists all saved plans.
 *
 * Props:
 *  - savedPlans             array of saved plans
 *  - getThisWeekCount(plan) returns number of workouts this week
 *  - onStartPlan(plan)      open plan detail
 *  - onDeletePlan(planId)   delete a plan
 *  - onCreateNewPlan(name)  create new plan + open detail
 */
export function PlanDirectoryView({
  savedPlans,
  getThisWeekCount,
  onStartPlan,
  onDeletePlan,
  onCreateNewPlan,
}) {
  const [showNewInput, setShowNewInput] = useState(false);
  const [newPlanName, setNewPlanName] = useState("");

  function handleCreatePress() {
    setShowNewInput(true);
  }

  function handleConfirmCreate() {
    var name = (newPlanName || "").trim();
    if (!name) return;
    onCreateNewPlan(name);
    setNewPlanName("");
    setShowNewInput(false);
  }

  function handleCancelCreate() {
    setShowNewInput(false);
    setNewPlanName("");
  }

  function renderPlanCard(info) {
    var plan = info.item;
    var weekCount = getThisWeekCount(plan);
    var exerciseCount = (plan.exercises || []).length;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={function () { onStartPlan(plan); }}
        activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          <Text style={styles.planName}>{plan.name || "Untitled Plan"}</Text>
          <Text style={styles.planMeta}>
            {exerciseCount} exercises  ·  {weekCount} this week
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={function () { onDeletePlan(plan.id); }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="remove-circle-outline" size={24} color={colors.error} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Plans</Text>

      {/* New plan input */}
      {showNewInput ? (
        <View style={styles.newPlanRow}>
          <TextInput
            style={styles.newPlanInput}
            placeholder="Plan name…"
            placeholderTextColor={colors.textTertiary}
            value={newPlanName}
            onChangeText={setNewPlanName}
            autoFocus
          />
          <TouchableOpacity style={styles.okButton} onPress={handleConfirmCreate}>
            <Text style={styles.okButtonText}>Create</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelCreate}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.createButton} onPress={handleCreatePress}>
          <Text style={styles.createButtonText}>＋  New Plan</Text>
        </TouchableOpacity>
      )}

      {/* Plans list */}
      {savedPlans.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>No plans yet.</Text>
          <Text style={styles.emptyHint}>
            Create a new plan or generate one with AI!
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedPlans}
          renderItem={renderPlanCard}
          keyExtractor={function (item) { return String(item.id); }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 20,
    ...shadow.sm,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.card,
  },
  newPlanRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  newPlanInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.textPrimary,
  },
  okButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  okButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.card,
  },
  cancelBtn: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  cancelText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 12,
    ...shadow.md,
  },
  cardContent: {
    flex: 1,
  },
  planName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  planMeta: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  deleteBtn: {
    padding: 4,
    marginLeft: 12,
  },
  deleteText: {
    fontSize: 18,
  },
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textDark,
  },
  emptyHint: {
    fontSize: 14,
    color: colors.textTertiary,
    marginTop: 6,
    textAlign: "center",
  },
});
