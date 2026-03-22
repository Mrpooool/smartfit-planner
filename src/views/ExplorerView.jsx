import { View, Text, TextInput, FlatList, StyleSheet } from "react-native";
import { ExerciseCardView } from "./ExerciseCardView";

export function ExplorerView({ exercises, searchPromiseState, customPlanCount, onSearch, onFilterChange, onAddExercise }) {
  // TODO: search TextInput → onSearch
  // TODO: filter chip row (muscle groups) → onFilterChange
  // TODO: FlatList of ExerciseCardView items
  // TODO: bottom bar showing customPlanCount + View/Save button
  // TODO: AsyncStateView for searchPromiseState
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Exercises</Text>
      {/* TODO: search bar */}
      {/* TODO: filter chips */}
      {/* TODO: exercise list */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
});
