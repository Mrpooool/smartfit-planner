import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radius, shadow, typography } from "../theme";
import { ExerciseImage } from "./common/ExerciseImage";
import ConfettiCannon from "react-native-confetti-cannon";

function formatTime(totalMs) {
  const totalSeconds = Math.floor(totalMs / 1000);
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  const ms = Math.floor((totalMs % 1000) / 10);
  const pad = function padCB(n) { return String(n).padStart(2, "0"); };
  if (hrs > 0) {
    return pad(hrs) + ":" + pad(mins) + ":" + pad(secs) + "." + pad(ms);
  }
  return pad(mins) + ":" + pad(secs) + "." + pad(ms);
}

export function TimerView({
  timeMs,
  isRunning,
  onStartPause,
  onStop,
  savedPlans,
  selectedPlan,
  currentExerciseIndex,
  currentSet,
  showConfetti,
  onSelectPlan,
  onNextSet,
  onExercisePress,
  onBackFromPlan,
}) {
  const insets = useSafeAreaInsets();
  const currentExercise = selectedPlan
    ? (selectedPlan.exercises || [])[currentExerciseIndex]
    : null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}
    >
      {/* ── Timer Display ── */}
      <View style={styles.timerSection}>
        <Text style={styles.timerDisplay}>{formatTime(timeMs)}</Text>

        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[styles.controlButton, isRunning ? styles.pauseButton : styles.playButton]}
            onPress={onStartPause}
          >
            <Ionicons
              name={isRunning ? "pause" : "play"}
              size={32}
              color={colors.card}
            />
          </TouchableOpacity>

          {(isRunning || timeMs > 0) ? (
            <TouchableOpacity style={styles.stopButton} onPress={onStop}>
              <Ionicons name="close" size={24} color={colors.card} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* ── Plan Selection or Exercise View ── */}
      {selectedPlan ? (
        <View style={styles.exerciseSection}>
          <View style={styles.planHeader}>
            <TouchableOpacity onPress={onBackFromPlan}>
              <Text style={styles.backText}>← Plans</Text>
            </TouchableOpacity>
            <Text style={styles.planName} numberOfLines={1}>{selectedPlan.name}</Text>
          </View>

          {currentExercise ? (
            <View style={styles.exerciseCard}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={function pressExACB() { onExercisePress(currentExercise); }}
              >
                <Text style={styles.exerciseName}>{currentExercise.name}</Text>
                <ExerciseImage
                  exercise={currentExercise}
                  style={styles.exerciseGif}
                  contentFit="contain"
                />
              </TouchableOpacity>

              <View style={styles.exerciseInfoRow}>
                <View style={styles.exerciseInfoLeft}>
                  <Text style={styles.exerciseInfoText}>
                    Target: {currentExercise.targetMuscle || "—"}
                  </Text>
                  <Text style={styles.exerciseInfoText}>
                    Equipment: {currentExercise.equipment || "Bodyweight"}
                  </Text>
                </View>
                <TouchableOpacity style={styles.skipButton} onPress={onNextSet}>
                  <Ionicons name="play-skip-forward" size={16} color={colors.primary} />
                  <Text style={styles.skipText}>Next Set</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.setsRepsRow}>
                <View style={styles.setsRepsItem}>
                  <Text style={styles.setsRepsLabel}>Sets</Text>
                  <Text style={styles.setsRepsValue}>{currentSet}/{currentExercise.sets || "—"}</Text>
                </View>
                <View style={styles.setsRepsItem}>
                  <Text style={styles.setsRepsLabel}>Reps</Text>
                  <Text style={styles.setsRepsValue}>{currentExercise.reps || "—"}</Text>
                </View>
                <View style={styles.setsRepsItem}>
                  <Text style={styles.setsRepsLabel}>Exercise</Text>
                  <Text style={styles.setsRepsValue}>
                    {currentExerciseIndex + 1}/{(selectedPlan.exercises || []).length}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <Text style={styles.emptyText}>No exercises in this plan.</Text>
          )}
        </View>
      ) : (
        <View style={styles.planListSection}>
          <Text style={styles.sectionTitle}>Start Training</Text>
          <Text style={styles.sectionSubtitle}>Select a plan to follow during your workout</Text>

          {(savedPlans || []).length === 0 ? (
            <Text style={styles.emptyText}>No saved plans yet. Create one from Home!</Text>
          ) : (
            (savedPlans || []).map(function renderPlanCB(plan) {
              return (
                <TouchableOpacity
                  key={plan.id}
                  style={styles.planItem}
                  onPress={function selectPlanACB() { onSelectPlan(plan.id); }}
                >
                  <View style={styles.planItemLeft}>
                    <Ionicons name="barbell-outline" size={20} color={colors.primary} />
                    <View style={styles.planItemText}>
                      <Text style={styles.planItemName} numberOfLines={1}>{plan.name}</Text>
                      <Text style={styles.planItemCount}>
                        {(plan.exercises || []).length} exercises
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                </TouchableOpacity>
              );
            })
          )}
        </View>
      )}

      {/* Confetti Animation */}
      {showConfetti && (
        <ConfettiCannon
          count={100}
          origin={{ x: -10, y: 0 }}
          autoStart={true}
          fadeOut={true}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },

  // Timer
  timerSection: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 20,
  },
  timerDisplay: {
    fontSize: 56,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: 2,
    marginBottom: 36,
    fontVariant: ["tabular-nums"],
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: {
    backgroundColor: colors.primary,
  },
  pauseButton: {
    backgroundColor: colors.primaryDark,
  },
  stopButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center",
  },

  // Exercise during training
  exerciseSection: { flex: 1 },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  backText: {
    ...typography.bodySemibold,
    color: colors.primary,
  },
  planName: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    flex: 1,
  },
  exerciseCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 16,
    ...shadow.md,
  },
  exerciseName: {
    ...typography.cardTitle,
    color: colors.textPrimary,
    marginBottom: 12,
    textTransform: "capitalize",
  },
  exerciseGif: {
    width: "100%",
    height: 220,
    borderRadius: radius.sm,
    marginBottom: 12,
  },
  exerciseInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  exerciseInfoLeft: { flex: 1 },
  exerciseInfoText: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: 4,
  },
  skipText: {
    ...typography.label,
    color: colors.primary,
  },
  setsRepsRow: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  setsRepsItem: {
    flex: 1,
    alignItems: "center",
  },
  setsRepsLabel: {
    ...typography.labelSm,
    color: colors.textTertiary,
    marginBottom: 4,
  },
  setsRepsValue: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
  },

  // Plan selection list
  planListSection: { flex: 1 },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  planItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: radius.md,
    marginBottom: 10,
    ...shadow.sm,
  },
  planItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  planItemText: { flex: 1 },
  planItemName: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
  },
  planItemCount: {
    ...typography.labelSm,
    color: colors.textTertiary,
    marginTop: 2,
  },
  emptyText: {
    ...typography.body,
    color: colors.textTertiary,
    textAlign: "center",
    marginTop: 40,
  },
});
