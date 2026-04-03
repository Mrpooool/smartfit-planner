import { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, shadow } from "../theme";

/**
 * Modal shown when user taps "Add" on an exercise in Explore.
 *
 * Props:
 *  - visible          boolean
 *  - exercise         the exercise object being added
 *  - savedPlans       array of saved plans
 *  - onSelectPlan(planId)    add exercise to existing plan
 *  - onCreateNewPlan(name)   create plan + add exercise
 *  - onClose()               dismiss modal
 */
export function AddToPlanModal({
  visible,
  exercise,
  savedPlans,
  onSelectPlan,
  onCreateNewPlan,
  onClose,
}) {
  const [showNewPlanInput, setShowNewPlanInput] = useState(false);
  const [newPlanName, setNewPlanName] = useState("");

  function handleSelectPlan(planId) {
    onSelectPlan(planId);
  }

  function handleCreatePress() {
    setShowNewPlanInput(true);
  }

  function handleConfirmCreate() {
    var name = (newPlanName || "").trim();
    if (!name) return;
    onCreateNewPlan(name);
    setNewPlanName("");
    setShowNewPlanInput(false);
  }

  function handleCancelCreate() {
    setShowNewPlanInput(false);
    setNewPlanName("");
  }

  function handleClose() {
    setShowNewPlanInput(false);
    setNewPlanName("");
    onClose();
  }

  function renderPlanItem(info) {
    var plan = info.item;
    return (
      <TouchableOpacity
        style={styles.planItem}
        onPress={function () { handleSelectPlan(plan.id); }}
        activeOpacity={0.7}
      >
        <View style={styles.planItemLeft}>
          <Text style={styles.planName}>{plan.name || "Untitled Plan"}</Text>
          <Text style={styles.planMeta}>
            {(plan.exercises || []).length} exercises
          </Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Add to Plan</Text>
            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Exercise being added */}
          {exercise ? (
            <View style={styles.exerciseBanner}>
              <Text style={styles.exerciseName} numberOfLines={1}>
                {exercise.name}
              </Text>
            </View>
          ) : null}

          {/* Saved plans list */}
          {savedPlans.length > 0 ? (
            <>
              <Text style={styles.sectionLabel}>Add to existing plan</Text>
              <FlatList
                data={savedPlans}
                renderItem={renderPlanItem}
                keyExtractor={function (item) { return String(item.id); }}
                style={styles.planList}
              />
            </>
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No saved plans yet.</Text>
            </View>
          )}

          {/* Create new plan */}
          {showNewPlanInput ? (
            <View style={styles.newPlanRow}>
              <TextInput
                style={styles.newPlanInput}
                placeholder="Plan name…"
                placeholderTextColor={colors.textTertiary}
                value={newPlanName}
                onChangeText={setNewPlanName}
                autoFocus
              />
              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmCreate}>
                <Text style={styles.confirmButtonText}>OK</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelCreate}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.createButton} onPress={handleCreatePress}>
              <Text style={styles.createButtonText}>＋  Create New Plan</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  container: {
    width: "100%",
    maxHeight: "70%",
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 20,
    ...shadow.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  closeButton: {
    fontSize: 20,
    color: colors.textTertiary,
    padding: 4,
  },
  exerciseBanner: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
    textTransform: "capitalize",
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 8,
  },
  planList: {
    maxHeight: 200,
  },
  planItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    padding: 14,
    marginBottom: 8,
  },
  planItemLeft: {
    flex: 1,
  },
  planName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  planMeta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  arrow: {
    fontSize: 20,
    color: colors.textTertiary,
    marginLeft: 8,
  },
  emptyBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.card,
  },
  newPlanRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  newPlanInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.textPrimary,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.card,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  cancelButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
