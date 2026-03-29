import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CalendarView } from "./CalendarView";

export function ProfileView({ email, completedDates, onOpenPlans, onLogout }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile & Progress</Text>
      <Text style={styles.email}>{email}</Text>

      <Text style={styles.sectionTitle}>My Saved Plans</Text>
      <TouchableOpacity style={styles.libraryButton} onPress={onOpenPlans}>
        <Text style={styles.libraryButtonText}>Open Saved Plans</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Workout Calendar</Text>
      <CalendarView completedDates={completedDates} />

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>🔥 LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 12,
  },
  libraryButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  libraryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  logoutButton: {
    marginTop: 24,
    padding: 14,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});