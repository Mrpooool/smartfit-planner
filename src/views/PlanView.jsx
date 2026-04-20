import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { colors, radius } from "../theme";
import { ExerciseImage } from "./common/ExerciseImage";

/**
 * Pure View component — only receives props, never accesses store.
 *
 * Props:
 *  - plan: WorkoutPlan | null
 *  - onSavePlan()        → save generated plan to library (preview mode only)
 *  - onMarkCompleted()   → mark today as completed
 *  - onEditExercise(idx, field, value) → edit sets/reps
 *  - onRenamePlan(name)  → rename plan
 *  - onDeletePlan()      → delete plan
 *  - onRegenerate()      → regenerate AI preview plan
 */
export function PlanView({
  plan,
  onSavePlan,
  onMarkCompleted,
  onEditExercise,
  onPressExercise,
  onRenamePlan,
  onDeletePlan,
  onRegenerate,
  isRegenerating = false,
  onAddExercise,
  onBack,
  previewMode = false,
}) {
  if (!plan) {
    return (
      <View style={styles.emptyContainer}>
        {onBack ? (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← My Plans</Text>
          </TouchableOpacity>
        ) : null}
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={styles.emptyText}>No plan selected.</Text>
        <Text style={styles.emptyHint}>Go generate or explore a plan first!</Text>
      </View>
    );
  }

  function renderExerciseCB(exercise, index) {
    return (
      <View key={exercise.id || index} style={styles.exerciseCard}>
        <TouchableOpacity activeOpacity={0.7} onPress={function onExercisePressCB() { onPressExercise(index); }}>
          {/* 计划页的大图同样交给共享组件处理，避免第三方图片接口失败时直接留空。 */}
          <ExerciseImage exercise={exercise} style={styles.gif} contentFit="contain" />

          <Text style={styles.exerciseName}>
            {index + 1}. {exercise.name}
          </Text>
          <Text style={styles.targetMuscle}>
            Target: {exercise.targetMuscle}  |  Equipment: {exercise.equipment || "Bodyweight"}
          </Text>
        </TouchableOpacity>

        <View style={styles.setsRepsRow}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Sets</Text>
            <TextInput
              style={styles.numberInput}
              keyboardType="number-pad"
              value={String(exercise.sets ?? "")}
              onChangeText={function onSetsChangeCB(v) {
                onEditExercise(index, "sets", v);
              }}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Reps</Text>
            <TextInput
              style={styles.numberInput}
              keyboardType="number-pad"
              value={String(exercise.reps ?? "")}
              onChangeText={function onRepsChangeCB(v) {
                onEditExercise(index, "reps", v);
              }}
            />
          </View>
        </View>

        {exercise.instructions && (Array.isArray(exercise.instructions) ? exercise.instructions.length > 0 : exercise.instructions.length > 0) ? (
          <View style={styles.instructionsBox}>
            <Text style={styles.instructionsTitle}>Instructions</Text>
            {Array.isArray(exercise.instructions) ? (
              exercise.instructions.map(function renderStepCB(step, i) {
                return (
                  <Text key={i} style={styles.instructions}>
                    {i + 1}. {step}
                  </Text>
                );
              })
            ) : (
              <Text style={styles.instructions}>{exercise.instructions}</Text>
            )}
          </View>
        ) : null}
      </View>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const isCompletedToday = plan ? (plan.completedDates || []).includes(today) : false;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {onBack ? (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← My Plans</Text>
        </TouchableOpacity>
      ) : null}

      <Text style={styles.label}>Plan Name</Text>
      <TextInput
        style={styles.planNameInput}
        value={plan.name || ""}
        placeholder="Enter a plan name…"
        placeholderTextColor="#9ca3af"
        onChangeText={onRenamePlan}
      />

      {(plan.exercises || []).map(renderExerciseCB)}

      {previewMode ? (
        <>
          {onRegenerate ? (
            <TouchableOpacity
              style={isRegenerating ? styles.regenerateButtonDisabled : styles.regenerateButton}
              onPress={onRegenerate}
              disabled={isRegenerating}
            >
              <Text style={isRegenerating ? styles.regenerateTextDisabled : styles.regenerateText}>
                {isRegenerating ? "Regenerating..." : "↻  REGENERATE PLAN"}
              </Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={isRegenerating ? styles.saveButtonDisabled : styles.saveButton}
            onPress={onSavePlan}
            disabled={isRegenerating}
          >
            <Text style={isRegenerating ? styles.saveButtonTextDisabled : styles.buttonText}>➕  ADD TO MY PLAN</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {onAddExercise ? (
            <TouchableOpacity style={styles.addExerciseButton} onPress={onAddExercise}>
              <Text style={styles.addExerciseText}>＋  Add Exercise from Explore</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={isCompletedToday ? styles.completeButtonDisabled : styles.completeButton}
            onPress={onMarkCompleted}
          >
            <Text style={isCompletedToday ? styles.buttonTextDisabled : styles.buttonText}>
              {isCompletedToday ? "✅  COMPLETED TODAY" : "✅  MARK AS COMPLETED"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={onDeletePlan}>
            <Ionicons name="remove-circle-outline" size={20} color={colors.error} style={{ marginRight: 6 }} />
            <Text style={styles.deleteButtonText}>Delete Plan</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 20, paddingBottom: 40 },
  backButton: { marginBottom: 12 },
  backButtonText: { fontSize: 16, fontWeight: "600", color: colors.primary },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: "600", color: "#374151" },
  emptyHint: { fontSize: 14, color: "#9ca3af", marginTop: 6 },
  label: { fontSize: 13, fontWeight: "600", color: "#6b7280", marginBottom: 6 },
  planNameInput: {
    fontSize: 20, fontWeight: "700", color: "#111827",
    borderBottomWidth: 2, borderBottomColor: "#6366f1",
    paddingVertical: 8, marginBottom: 24,
  },
  exerciseCard: {
    backgroundColor: "#ffffff", borderRadius: 14,
    padding: 16, marginBottom: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  gif: { width: "100%", height: 200, borderRadius: 10, marginBottom: 12 },
  exerciseName: { fontSize: 17, fontWeight: "700", color: "#111827" },
  targetMuscle: { fontSize: 13, color: "#6366f1", marginTop: 2, marginBottom: 10 },
  setsRepsRow: { flexDirection: "row", gap: 16, marginBottom: 10 },
  fieldGroup: { flex: 1 },
  fieldLabel: { fontSize: 12, fontWeight: "600", color: "#6b7280", marginBottom: 4 },
  numberInput: {
    backgroundColor: "#f3f4f6", borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 16, fontWeight: "600", color: "#111827",
    textAlign: "center",
  },
  instructionsBox: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border },
  instructionsTitle: { fontSize: 13, fontWeight: "600", color: colors.textSecondary, marginBottom: 4 },
  instructions: { fontSize: 13, color: colors.textMuted, lineHeight: 18, marginTop: 4 },
  saveButton: {
    backgroundColor: "#6366f1", padding: 16, borderRadius: 12,
    alignItems: "center", marginTop: 12,
  },
  saveButtonDisabled: {
    backgroundColor: "#c7d2fe", padding: 16, borderRadius: 12,
    alignItems: "center", marginTop: 12,
  },
  saveButtonTextDisabled: {
    color: "#eef2ff", fontWeight: "bold", fontSize: 15,
  },
  regenerateButton: {
    backgroundColor: "#ffffff", padding: 16, borderRadius: 12,
    alignItems: "center", marginTop: 12, borderWidth: 1, borderColor: "#6366f1",
  },
  regenerateButtonDisabled: {
    backgroundColor: "#f3f4f6", padding: 16, borderRadius: 12,
    alignItems: "center", marginTop: 12, borderWidth: 1, borderColor: "#d1d5db",
  },
  regenerateText: {
    color: "#6366f1", fontWeight: "bold", fontSize: 15,
  },
  regenerateTextDisabled: {
    color: "#9ca3af", fontWeight: "bold", fontSize: 15,
  },
  addExerciseButton: {
    backgroundColor: "#6366f1", padding: 16, borderRadius: 12,
    alignItems: "center", marginTop: 12,
  },
  addExerciseText: {
    color: "#fff", fontWeight: "bold", fontSize: 15,
  },
  completeButton: {
    backgroundColor: "#10b981", padding: 16, borderRadius: 12,
    alignItems: "center", marginTop: 12,
  },
  completeButtonDisabled: {
    backgroundColor: "#d1d5db", padding: 16, borderRadius: 12,
    alignItems: "center", marginTop: 12,
  },
  buttonTextDisabled: { color: "#6b7280", fontWeight: "bold", fontSize: 15 },
  deleteButton: {
    flexDirection: "row", justifyContent: "center",
    backgroundColor: "transparent", padding: 16, borderRadius: radius.md,
    alignItems: "center", marginTop: 12, borderWidth: 1, borderColor: colors.error,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  deleteButtonText: { color: "#ef4444", fontWeight: "bold", fontSize: 15 },
});
