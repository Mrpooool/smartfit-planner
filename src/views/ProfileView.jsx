import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { CalendarView } from "./CalendarView";
<<<<<<< Updated upstream
import { ChartView } from "./ChartView";
=======
import { colors, radius, shadow } from "../theme";

export function ProfileView({ email, completedDates, totalWorkouts, thisWeekCount, savedPlansCount, onNavigateToPlans, onLogout }) {
  const avatarLetter = email ? email[0].toUpperCase() : "?";
>>>>>>> Stashed changes

export function ProfileView({ savedPlans, email, onStartPlan, onDeletePlan, onLogout }) {
  // TODO: saved plans list with START and delete buttons
  // TODO: CalendarView with completedDates highlighted
  // TODO: ChartView with weekly workout count
  // TODO: empty state when savedPlans is empty
  return (
<<<<<<< Updated upstream
    <View style={styles.container}>
      <Text style={styles.title}>Profile & Progress</Text>
      <Text style={styles.email}>{email}</Text>
      {/* TODO: saved plans list */}
      {/* TODO: CalendarView */}
      {/* TODO: ChartView */}
=======
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar + user info */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarLetter}</Text>
        </View>
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

>>>>>>> Stashed changes
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>🔥 LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
<<<<<<< Updated upstream
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  email: { fontSize: 14, color: "#6b7280", marginBottom: 20 },
  logoutButton: { marginTop: 24, padding: 14, backgroundColor: "#ef4444", borderRadius: 10, alignItems: "center" },
  logoutText: { color: "#fff", fontWeight: "bold" },
});
=======
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
    borderRadius: 36,
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
>>>>>>> Stashed changes
