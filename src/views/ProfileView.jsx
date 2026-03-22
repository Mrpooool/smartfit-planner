import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { CalendarView } from "./CalendarView";
import { ChartView } from "./ChartView";

export function ProfileView({ savedPlans, email, onStartPlan, onDeletePlan, onLogout }) {
  // TODO: saved plans list with START and delete buttons
  // TODO: CalendarView with completedDates highlighted
  // TODO: ChartView with weekly workout count
  // TODO: empty state when savedPlans is empty
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile & Progress</Text>
      <Text style={styles.email}>{email}</Text>
      {/* TODO: saved plans list */}
      {/* TODO: CalendarView */}
      {/* TODO: ChartView */}
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>🔥 LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  email: { fontSize: 14, color: "#6b7280", marginBottom: 20 },
  logoutButton: { marginTop: 24, padding: 14, backgroundColor: "#ef4444", borderRadius: 10, alignItems: "center" },
  logoutText: { color: "#fff", fontWeight: "bold" },
});
