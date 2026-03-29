import { Image } from "expo-image";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getExerciseImageSource } from "../api/exerciseDbApi";
import { colors, radius, shadow } from "../theme";

/**
 * Pure View component — only receives props, never accesses store.
 *
 * Props:
 *  - plan: WorkoutPlan | null
 *  - onSavePlan()        → save to library
 *  - onMarkCompleted()   → mark today as completed
 *  - onEditExercise(idx, field, value) → edit sets/reps
 *  - onRenamePlan(name)  → rename plan
 *  - onDeletePlan()      → delete plan
 */
export function PlanView({
  plan,
  onSavePlan,
  onMarkCompleted,
  onEditExercise,
  onPressExercise,
  onRenamePlan,
  onDeletePlan,
  previewMode = false,
}) {
  if (!plan) {
    return (
      <View style={styles.emptyContainer}>
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
          {/* Exercise GIF */}
          {exercise.exerciseDbId ? (
            <Image
              source={getExerciseImageSource(exercise.exerciseDbId,360)}
              style={styles.gif}
              contentFit="contain"
            />
          ) : (
            <View style={styles.gifPlaceholder}>
              <Text style={styles.gifPlaceholderText}>🏋️</Text>
            </View>
          )}

          {/* Exercise Info */}
          <Text style={styles.exerciseName}>
            {index + 1}. {exercise.name}
          </Text>
          <Text style={styles.targetMuscle}>
            Target: {exercise.targetMuscle}  |  Equipment: {exercise.equipment || "Bodyweight"}
          </Text>
        </TouchableOpacity>

        {/* Editable Sets & Reps */}
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

      </View>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const isCompletedToday = plan ? (plan.completedDates || []).includes(today) : false;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Plan Name — editable */}
      <Text style={styles.label}>Plan Name</Text>
      <TextInput
        style={styles.planNameInput}
        value={plan.name || ""}
        placeholder="Enter a plan name…"
        placeholderTextColor="#9ca3af"
        onChangeText={onRenamePlan}
      />

      {/* Exercise List */}
      {(plan.exercises || []).map(renderExerciseCB)}

      {/* Action Buttons */}
      {previewMode ? (
        <TouchableOpacity style={styles.saveButton} onPress={onSavePlan}>
          <Text style={styles.buttonText}>➕  ADD TO MY PLAN</Text>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity style={styles.saveButton} onPress={onSavePlan}>
            <Text style={styles.buttonText}>⭐  SAVE PLAN TO LIBRARY</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={isCompletedToday ? styles.completeButtonDisabled : styles.completeButton} 
            onPress={onMarkCompleted}
          >
            <Text style={isCompletedToday ? styles.buttonTextDisabled : styles.buttonText}>
              {isCompletedToday ? "✅  COMPLETED TODAY" : "✅  MARK AS COMPLETED"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={onDeletePlan}>
            <Text style={styles.deleteButtonText}>🗑️  Delete Plan</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Container
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },

  // Empty state
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: "600", color: colors.textDark },
  emptyHint: { fontSize: 14, color: colors.textTertiary, marginTop: 6 },

  // Plan name input
  label: { fontSize: 13, fontWeight: "600", color: colors.textSecondary, marginBottom: 6 },
  planNameInput: {
    fontSize: 20, fontWeight: "700", color: colors.textPrimary,
    borderBottomWidth: 2, borderBottomColor: colors.primary,
    paddingVertical: 8, marginBottom: 24,
  },

  // Exercise card
  exerciseCard: {
    backgroundColor: colors.card, borderRadius: 14,
    padding: 16, marginBottom: 16,
    ...shadow.md,
  },
  gif: { width: "100%", height: 200, borderRadius: 10, marginBottom: 12 },
  gifPlaceholder: {
    width: "100%", height: 120, borderRadius: 10,
    backgroundColor: colors.surface, justifyContent: "center", alignItems: "center",
    marginBottom: 12,
  },
  gifPlaceholderText: { fontSize: 36 },
  exerciseName: { fontSize: 17, fontWeight: "700", color: colors.textPrimary },
  targetMuscle: { fontSize: 13, color: colors.primary, marginTop: 2, marginBottom: 10 },

  // Sets & Reps
  setsRepsRow: { flexDirection: "row", gap: 16, marginBottom: 10 },
  fieldGroup: { flex: 1 },
  fieldLabel: { fontSize: 12, fontWeight: "600", color: colors.textSecondary, marginBottom: 4 },
  numberInput: {
    backgroundColor: colors.surface, borderRadius: radius.sm,
    paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 16, fontWeight: "600", color: colors.textPrimary,
    textAlign: "center",
  },

  // Instructions
  instructions: { fontSize: 13, color: colors.textMuted, lineHeight: 18, marginTop: 4 },

  // Buttons
  saveButton: {
    backgroundColor: colors.primary, padding: 16, borderRadius: radius.md,
    alignItems: "center", marginTop: 20,
  },
  completeButton: {
    backgroundColor: colors.success, padding: 16, borderRadius: radius.md,
    alignItems: "center", marginTop: 12,
  },
  completeButtonDisabled: {
    backgroundColor: colors.disabled, padding: 16, borderRadius: radius.md,
    alignItems: "center", marginTop: 12,
  },
  buttonTextDisabled: { color: colors.textSecondary, fontWeight: "bold", fontSize: 15 },
  deleteButton: {
    backgroundColor: "transparent", padding: 16, borderRadius: radius.md,
    alignItems: "center", marginTop: 12, borderWidth: 1, borderColor: colors.error,
  },
  buttonText: { color: colors.card, fontWeight: "bold", fontSize: 15 },
  deleteButtonText: { color: colors.error, fontWeight: "bold", fontSize: 15 },
});
