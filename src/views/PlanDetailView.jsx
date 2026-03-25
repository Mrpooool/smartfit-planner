import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";

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
export function PlanDetailView({
  plan,
  onSavePlan,
  onMarkCompleted,
  onEditExercise,
  onRenamePlan,
  onDeletePlan,
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
        {/* Exercise GIF */}
        {exercise.gifUrl ? (
          <Image
            source={{ uri: exercise.gifUrl }}
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
        <Text style={styles.targetMuscle}>Target: {exercise.targetMuscle}</Text>

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

        {/* Instructions */}
        {exercise.instructions ? (
          <Text style={styles.instructions}>📝 {exercise.instructions}</Text>
        ) : null}
      </View>
    );
  }

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
      <TouchableOpacity style={styles.saveButton} onPress={onSavePlan}>
        <Text style={styles.buttonText}>⭐  SAVE PLAN TO LIBRARY</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.completeButton} onPress={onMarkCompleted}>
        <Text style={styles.buttonText}>✅  MARK AS COMPLETED</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={onDeletePlan}>
        <Text style={styles.deleteButtonText}>🗑️  Delete Plan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Container
  container: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 20, paddingBottom: 40 },

  // Empty state
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: "600", color: "#374151" },
  emptyHint: { fontSize: 14, color: "#9ca3af", marginTop: 6 },

  // Plan name input
  label: { fontSize: 13, fontWeight: "600", color: "#6b7280", marginBottom: 6 },
  planNameInput: {
    fontSize: 20, fontWeight: "700", color: "#111827",
    borderBottomWidth: 2, borderBottomColor: "#6366f1",
    paddingVertical: 8, marginBottom: 24,
  },

  // Exercise card
  exerciseCard: {
    backgroundColor: "#ffffff", borderRadius: 14,
    padding: 16, marginBottom: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  gif: { width: "100%", height: 200, borderRadius: 10, marginBottom: 12 },
  gifPlaceholder: {
    width: "100%", height: 120, borderRadius: 10,
    backgroundColor: "#f3f4f6", justifyContent: "center", alignItems: "center",
    marginBottom: 12,
  },
  gifPlaceholderText: { fontSize: 36 },
  exerciseName: { fontSize: 17, fontWeight: "700", color: "#111827" },
  targetMuscle: { fontSize: 13, color: "#6366f1", marginTop: 2, marginBottom: 10 },

  // Sets & Reps
  setsRepsRow: { flexDirection: "row", gap: 16, marginBottom: 10 },
  fieldGroup: { flex: 1 },
  fieldLabel: { fontSize: 12, fontWeight: "600", color: "#6b7280", marginBottom: 4 },
  numberInput: {
    backgroundColor: "#f3f4f6", borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 16, fontWeight: "600", color: "#111827",
    textAlign: "center",
  },

  // Instructions
  instructions: { fontSize: 13, color: "#4b5563", lineHeight: 18, marginTop: 4 },

  // Buttons
  saveButton: {
    backgroundColor: "#6366f1", padding: 16, borderRadius: 12,
    alignItems: "center", marginTop: 20,
  },
  completeButton: {
    backgroundColor: "#10b981", padding: 16, borderRadius: 12,
    alignItems: "center", marginTop: 12,
  },
  deleteButton: {
    backgroundColor: "transparent", padding: 16, borderRadius: 12,
    alignItems: "center", marginTop: 12, borderWidth: 1, borderColor: "#ef4444",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  deleteButtonText: { color: "#ef4444", fontWeight: "bold", fontSize: 15 },
});
