import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { getExerciseImageSource } from "../api/exerciseDbApi";

export function ExerciseCardView({ exercise, isAdded, onAdd, onPress }) {
  function handleAddPress() {
    if (onAdd) {
      onAdd(exercise);
    }
  }

  function handleCardPress() {
    if (onPress) {
      onPress(exercise);
    }
  }

  function renderImageSection() {
    if (exercise?.gifUrl) {
      return (
        <Image
          source={{ uri: exercise.gifUrl }}
          style={styles.image}
          contentFit="cover"
        />
      );
    }

    if (exercise?.id) {
      return (
        <Image
          source={getExerciseImageSource(exercise.id, 360)}
          style={styles.image}
          contentFit="cover"
        />
      );
    }

    return (
      <View style={[styles.image, styles.placeholder]}>
        <Text>GIF</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardMain} onPress={handleCardPress}>
        {renderImageSection()}
        <View style={styles.info}>
          <Text style={styles.name}>{exercise?.name}</Text>
          <Text style={styles.muscle}>{exercise?.targetMuscle}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
        <Text style={styles.addButtonText}>{isAdded ? "Added" : "Add"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  image: {
    width: 50,
    height: 50,
    backgroundColor: "#eee",
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
  },
  muscle: {
    fontSize: 13,
    color: "#666",
  },
  addButton: {
    borderWidth: 1,
    borderColor: "#999",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  addButtonText: {
    fontSize: 13,
  },
});
