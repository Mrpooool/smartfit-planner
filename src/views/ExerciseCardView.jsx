import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";

<<<<<<< Updated upstream
export function ExerciseCardView({ exercise, isAdded, onAdd }) {
=======
export function ExerciseCardView({ exercise, onAdd, onPress }) {
>>>>>>> Stashed changes
  function handleAddPress() {
    if (onAdd) {
      onAdd(exercise);
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

    return (
      <View style={[styles.image, styles.placeholder]}>
        <Text>GIF</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
<<<<<<< Updated upstream
      {renderImageSection()}
      <View style={styles.info}>
        <Text style={styles.name}>{exercise?.name}</Text>
        <Text style={styles.muscle}>{exercise?.targetMuscle}</Text>

      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
        <Text style={styles.addButtonText}>{isAdded ? "Added" : "Add"}</Text>
=======
      <TouchableOpacity style={styles.cardMain} onPress={handleCardPress} activeOpacity={0.7}>
        {renderImageSection()}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>{exercise?.name}</Text>
          <Text style={styles.muscle}>{exercise?.targetMuscle}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddPress}
        activeOpacity={0.7}
      >
        <Text style={styles.addButtonText}>＋ Add</Text>
>>>>>>> Stashed changes
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
  debugText: {
    fontSize: 10,
    color: "#999",
  },
  addButton: {
<<<<<<< Updated upstream
    borderWidth: 1,
    borderColor: "#999",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  addButtonText: {
    fontSize: 13,
=======
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.sm,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.card,
>>>>>>> Stashed changes
  },
});
