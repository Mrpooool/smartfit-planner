import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radius, shadow, typography } from "../theme";
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
  onDeleteExercise,
  onPressExercise,
  onRenamePlan,
  onDeletePlan,
  onRegenerate,
  isRegenerating = false,
  onAddExercise,
  onBack,
  previewMode = false,
}) {
  const insets = useSafeAreaInsets();

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

        {onDeleteExercise ? (
          <TouchableOpacity
            style={styles.exerciseDeleteButton}
            onPress={function onExerciseDeletePressCB() { onDeleteExercise(index); }}
          >
            <Ionicons name="trash-outline" size={18} color={colors.error} style={{ marginRight: 6 }} />
            <Text style={styles.exerciseDeleteText}>Delete Exercise</Text>
          </TouchableOpacity>
        ) : null}

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
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}>
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
        placeholderTextColor={colors.textTertiary}
        onChangeText={onRenamePlan}
      />

      {(plan.exercises || []).map(renderExerciseCB)}

      {previewMode ? (
        <>
          {onRegenerate ? (
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.outlineButton,
                isRegenerating && styles.outlineButtonDisabled,
              ]}
              onPress={onRegenerate}
              disabled={isRegenerating}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  styles.outlineButtonText,
                  isRegenerating && styles.mutedButtonText,
                ]}
              >
                {isRegenerating ? "Regenerating..." : "↻  REGENERATE PLAN"}
              </Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.primaryButton,
              isRegenerating && styles.primaryButtonDisabled,
            ]}
            onPress={onSavePlan}
            disabled={isRegenerating}
          >
            <Text
              style={[
                styles.actionButtonText,
                isRegenerating ? styles.primaryButtonTextDisabled : styles.inverseButtonText,
              ]}
            >
              ➕  ADD TO MY PLAN
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {onAddExercise ? (
            <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={onAddExercise}>
              <Text style={[styles.actionButtonText, styles.inverseButtonText]}>＋  Add Exercise from Explore</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={[
              styles.actionButton,
              isCompletedToday ? styles.neutralButton : styles.successButton,
            ]}
            onPress={onMarkCompleted}
          >
            <Text
              style={[
                styles.actionButtonText,
                isCompletedToday ? styles.secondaryButtonText : styles.inverseButtonText,
              ]}
            >
              {isCompletedToday ? "✅  COMPLETED TODAY" : "✅  MARK AS COMPLETED"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={onDeletePlan}>
            <Ionicons name="remove-circle-outline" size={20} color={colors.error} style={{ marginRight: 6 }} />
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete Plan</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  backButton: { marginBottom: 12 },
  backButtonText: { ...typography.bodySemibold, color: colors.primary },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: colors.background,
  },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { ...typography.sectionTitle, fontWeight: "600", color: colors.textDark },
  emptyHint: { fontSize: 14, color: colors.textTertiary, marginTop: 6 },
  label: { ...typography.label, color: colors.textSecondary, marginBottom: 6 },
  planNameInput: {
    ...typography.inputTitle,
    color: colors.textPrimary,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingVertical: 8,
    marginBottom: 24,
  },
  exerciseCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 16,
    ...shadow.md,
  },
  gif: { width: "100%", height: 200, borderRadius: radius.sm, marginBottom: 12 },
  exerciseName: { ...typography.cardTitle, color: colors.textPrimary },
  targetMuscle: { ...typography.label, color: colors.primary, marginTop: 2, marginBottom: 10 },
  exerciseDeleteButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.error,
    marginBottom: 12,
  },
  exerciseDeleteText: { ...typography.label, color: colors.error },
  setsRepsRow: { flexDirection: "row", gap: 16, marginBottom: 10 },
  fieldGroup: { flex: 1 },
  fieldLabel: { ...typography.labelSm, color: colors.textSecondary, marginBottom: 4 },
  numberInput: {
    ...typography.bodySemibold,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.textPrimary,
    textAlign: "center",
  },
  instructionsBox: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border },
  instructionsTitle: { ...typography.label, color: colors.textSecondary, marginBottom: 4 },
  instructions: { fontSize: 13, color: colors.textMuted, lineHeight: 18, marginTop: 4 },
  actionButton: {
    padding: 16,
    borderRadius: radius.md,
    alignItems: "center",
    marginTop: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryButtonDisabled: {
    backgroundColor: colors.primaryBorder,
  },
  successButton: {
    backgroundColor: colors.success,
  },
  neutralButton: {
    backgroundColor: colors.disabled,
  },
  outlineButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  outlineButtonDisabled: {
    backgroundColor: colors.surface,
    borderColor: colors.borderLight,
  },
  deleteButton: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.error,
  },
  actionButtonText: { ...typography.button },
  inverseButtonText: { color: colors.card },
  primaryButtonTextDisabled: { color: colors.primaryDark },
  outlineButtonText: { color: colors.primary },
  secondaryButtonText: { color: colors.textSecondary },
  mutedButtonText: { color: colors.disabledText },
  deleteButtonText: { color: colors.error },
});
