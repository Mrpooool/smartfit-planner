import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CalendarView } from "./CalendarView";
import { colors, radius, shadow } from "../theme";

export function ProfileView({ email, username, completedDates, totalWorkouts, thisWeekCount, savedPlansCount, onNavigateToPlans, onLogout }) {
  const avatarLetter = username ? username[0].toUpperCase() : "?";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar + user info */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarLetter}</Text>
        </View>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      {/* Stats row */}
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

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },

  // Header
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

  // Stats
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
    marginTop: 4,
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
