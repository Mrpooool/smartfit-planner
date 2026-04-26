import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CalendarView } from "./CalendarView";
import { colors, radius, shadow, typography } from "../theme";

export function ProfileView({
  email,
  username,
  completedDates,
  workoutsByDate = {},
  totalWorkouts,
  thisWeekCount,
  savedPlansCount,
  onNavigateToPlans,
  onLogout,
}) {
  const avatarLetter = username ? username[0].toUpperCase() : "?";
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isCompact = width < 720;
  const [selectedDate, setSelectedDate] = useState(null);
  const selectedWorkouts = selectedDate ? (workoutsByDate[selectedDate] || []) : [];
  const hasCompletedDate = selectedDate ? (completedDates || []).includes(selectedDate) : false;

  function handleDatePress(day) {
    setSelectedDate(day.dateString);
  }

  function renderWorkoutCB(workout, workoutIndex) {
    const exercises = workout.exercises || [];
    const visibleExercises = exercises.slice(0, 5);

    return (
      <View key={workout.id || workoutIndex} style={styles.workoutBlock}>
        <Text style={styles.workoutPlanName}>{workout.planName || "Workout"}</Text>
        {visibleExercises.length > 0 ? (
          visibleExercises.map(function renderExerciseCB(exercise, exerciseIndex) {
            return (
              <Text key={exercise.id || exerciseIndex} style={styles.workoutExercise}>
                {exerciseIndex + 1}. {exercise.name || "Exercise"} - {exercise.sets || "-"} sets x {exercise.reps || "-"} reps
              </Text>
            );
          })
        ) : (
          <Text style={styles.workoutDetailsEmpty}>No exercise details saved.</Text>
        )}
        {exercises.length > visibleExercises.length ? (
          <Text style={styles.moreExercisesText}>+{exercises.length - visibleExercises.length} more exercises</Text>
        ) : null}
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}>
      <View style={[styles.profilePanel, isCompact && styles.profilePanelCompact]}>
        <View style={styles.userInfo}>
          <View style={[styles.avatar, isCompact && styles.avatarCompact]}>
            <Text style={[styles.avatarText, isCompact && styles.avatarTextCompact]}>{avatarLetter}</Text>
          </View>
          <View style={styles.userTextBlock}>
            <Text style={[styles.username, isCompact && styles.usernameCompact]}>{username}</Text>
            <Text style={[styles.email, isCompact && styles.emailCompact]}>{email}</Text>
          </View>
        </View>

        <View style={[styles.summaryArea, isCompact && styles.summaryAreaCompact]}>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, isCompact && styles.statCardCompact]}>
              <Text style={[styles.statNumber, isCompact && styles.statNumberCompact]}>{totalWorkouts}</Text>
              <Text style={styles.statLabel}>Total Workouts</Text>
            </View>
            <View style={[styles.statCard, isCompact && styles.statCardCompact]}>
              <Text style={[styles.statNumber, isCompact && styles.statNumberCompact]}>{thisWeekCount}</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
          </View>

          <TouchableOpacity style={[styles.savedPlansButton, isCompact && styles.savedPlansButtonCompact]} onPress={onNavigateToPlans}>
            <View>
              <Text style={[styles.savedPlansNumber, isCompact && styles.savedPlansNumberCompact]}>{savedPlansCount}</Text>
              <Text style={[styles.savedPlansLabel, isCompact && styles.savedPlansLabelCompact]}>Saved Plans</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.sectionTitle, isCompact && styles.sectionTitleCompact]}>Workout Calendar</Text>
      <CalendarView
        completedDates={completedDates}
        compact={isCompact}
        selectedDate={selectedDate}
        onDatePress={handleDatePress}
      />

      {selectedDate ? (
        <View style={styles.workoutDetailsCard}>
          <Text style={styles.workoutDetailsTitle}>{formatDateLabel(selectedDate)}</Text>
          {selectedWorkouts.length > 0 ? (
            selectedWorkouts.map(renderWorkoutCB)
          ) : (
            <Text style={styles.workoutDetailsEmpty}>
              {hasCompletedDate ? "Workout completed. Details were not saved for this older record." : "No workout recorded for this date."}
            </Text>
          )}
        </View>
      ) : null}

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function formatDateLabel(dateString) {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },

  profilePanel: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    gap: 18,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 20,
    marginBottom: 24,
    ...shadow.sm,
  },
  profilePanelCompact: {
    flexDirection: "column",
    gap: 12,
    padding: 14,
    marginBottom: 18,
  },
  userInfo: {
    flex: 1,
    minWidth: 220,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.card,
  },
  avatarCompact: {
    width: 56,
    height: 56,
  },
  avatarTextCompact: {
    fontSize: 26,
  },
  userTextBlock: {
    flex: 1,
  },
  username: {
    ...typography.inputTitle,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  usernameCompact: {
    fontSize: 18,
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emailCompact: {
    fontSize: 13,
  },

  summaryArea: {
    width: 360,
    maxWidth: "100%",
    gap: 10,
  },
  summaryAreaCompact: {
    width: "100%",
    gap: 8,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  statCardCompact: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 2,
  },
  statNumberCompact: {
    fontSize: 20,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 16,
  },
  savedPlansButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    borderRadius: radius.sm,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  savedPlansButtonCompact: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  savedPlansNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 2,
  },
  savedPlansNumberCompact: {
    fontSize: 20,
  },
  savedPlansLabel: {
    ...typography.bodySemibold,
    color: colors.primaryDark,
  },
  savedPlansLabelCompact: {
    fontSize: 14,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 16,
  },
  sectionTitleCompact: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 0,
  },
  workoutDetailsCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 10,
    ...shadow.sm,
  },
  workoutDetailsTitle: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  workoutBlock: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    marginTop: 8,
  },
  workoutPlanName: {
    ...typography.label,
    color: colors.primaryDark,
    marginBottom: 6,
  },
  workoutExercise: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
    marginBottom: 2,
  },
  workoutDetailsEmpty: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  moreExercisesText: {
    ...typography.labelSm,
    color: colors.primary,
    marginTop: 4,
  },

  logoutButton: {
    marginTop: 4,
    padding: 12,
    backgroundColor: colors.error,
    borderRadius: radius.sm,
    alignItems: "center",
  },
  logoutText: {
    color: colors.card,
    fontWeight: "bold",
  },
});
