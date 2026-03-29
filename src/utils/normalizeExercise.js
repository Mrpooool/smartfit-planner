export function normalizeExerciseFromDb(exercise, overrides = {}) {
  const exerciseDbId = exercise?.id ? String(exercise.id) : "";

  return {
    id: exerciseDbId,
    exerciseDbId: exerciseDbId,
    name: exercise?.name || overrides.name || "Unknown",
    targetMuscle: exercise?.target || exercise?.targetMuscle || overrides.targetMuscle || "Unknown",
    bodyPart: exercise?.bodyPart || "",
    equipment: exercise?.equipment || overrides.equipment || "Unknown",
    gifUrl: exercise?.gifUrl || exercise?.imageUrl || exercise?.image || "",
    instructions: Array.isArray(exercise?.instructions)
      ? exercise.instructions
      : (exercise?.instructions ? [exercise.instructions] : []),
    secondaryMuscles: Array.isArray(exercise?.secondaryMuscles) ? exercise.secondaryMuscles : [],
    description: exercise?.description || "",
    difficulty: exercise?.difficulty || "",
    category: exercise?.category || "",
    sets: overrides.sets ?? exercise?.sets,
    reps: overrides.reps ?? exercise?.reps,
  };
}
