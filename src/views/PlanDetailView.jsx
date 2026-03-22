import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from "react-native";

export function PlanDetailView({ plan, onSavePlan, onMarkCompleted, onEditExercise }) {
  // TODO: editable plan name (TextInput)
  // TODO: ScrollView of exercises with GIF, editable sets/reps, instructions
  // TODO: SAVE PLAN button → onSavePlan
  // TODO: MARK AS COMPLETED button → onMarkCompleted
  if (!plan) return <View><Text>No plan selected.</Text></View>;

  return (
    <ScrollView style={styles.container}>
      {/* TODO: plan name input */}
      {/* TODO: exercise list */}
      <TouchableOpacity style={styles.saveButton} onPress={() => onSavePlan(plan)}>
        <Text style={styles.buttonText}>⭐ SAVE PLAN TO LIBRARY</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.completeButton} onPress={() => onMarkCompleted(plan.id)}>
        <Text style={styles.buttonText}>📦 MARK AS COMPLETED</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  saveButton: { backgroundColor: "#6366f1", padding: 16, borderRadius: 12, alignItems: "center", marginTop: 16 },
  completeButton: { backgroundColor: "#10b981", padding: 16, borderRadius: 12, alignItems: "center", marginTop: 12 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
