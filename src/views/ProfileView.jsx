import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CalendarView } from "./CalendarView";
import { colors, radius, shadow } from "../theme";

export function ProfileView({
  email,
  username,
  completedDates,
  totalWorkouts,
  thisWeekCount,
  savedPlansCount,
  showAnimatedListImages,
  onImageModeChange,
  onNavigateToPlans,
  onLogout,
}) {
  const avatarLetter = username ? username[0].toUpperCase() : "?";

  function renderImageModeButton(useAnimatedImages, label, hint) {
    const selected = Boolean(showAnimatedListImages) === useAnimatedImages;

    function handlePress() {
      if (onImageModeChange) {
        onImageModeChange(useAnimatedImages);
      }
    }

    return (
      <TouchableOpacity
        style={[styles.imageModeButton, selected && styles.imageModeButtonActive]}
        onPress={handlePress}
      >
        <Text style={[styles.imageModeLabel, selected && styles.imageModeLabelActive]}>
          {label}
        </Text>
        <Text style={[styles.imageModeHint, selected && styles.imageModeHintActive]}>
          {hint}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarLetter}</Text>
        </View>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalWorkouts}</Text>
          <Text style={styles.statLabel}>Total{"\n"}Workouts</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{thisWeekCount}</Text>
          <Text style={styles.statLabel}>This{"\n"}Week</Text>
        </View>
        <TouchableOpacity style={styles.statCard} onPress={onNavigateToPlans}>
          <Text style={styles.statNumber}>{savedPlansCount}</Text>
          <Text style={styles.statLabel}>Saved{"\n"}Plans</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Workout Calendar</Text>
      <CalendarView completedDates={completedDates} />

      <Text style={styles.sectionTitle}>Exercise Preview</Text>
      <View style={styles.imageModeRow}>
        {renderImageModeButton(
          false,
          "Data Saver",
          "Use lightweight previews to save mobile data and run more smoothly on lower-end phones"
        )}
        {renderImageModeButton(
          true,
          "Motion Preview",
          "Show animated thumbnails for the richest browsing experience when network conditions are good"
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.card,
  },
  username: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: "center",
    ...shadow.sm,
  },
  statNumber: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 16,
  },
  imageModeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  imageModeButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  imageModeButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  imageModeLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  imageModeLabelActive: {
    color: colors.primaryDark,
  },
  imageModeHint: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  imageModeHintActive: {
    color: colors.primaryDark,
  },
  logoutButton: {
    marginTop: 8,
    padding: 14,
    backgroundColor: colors.error,
    borderRadius: radius.sm,
    alignItems: "center",
  },
  logoutText: {
    color: colors.card,
    fontWeight: "bold",
  },
});
