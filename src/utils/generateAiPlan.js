import { searchExercisesByName } from "../api/exerciseDbApi";
import { generateWorkoutPlan } from "../api/glmApi";
import { normalizeExerciseFromDb } from "./normalizeExercise";

const SEARCH_QUERY_ALIASES = {
  "push up": "push-up",
  pushup: "push-up",
  pushups: "push-up",
  "air squat": "squat",
  "bodyweight squat": "squat",
  "abdominal crunch": "crunch",
  "glute bridge hold": "glute bridge",
  "walking lunges": "lunge",
  "bent over dumbbell row": "dumbbell row",
  "dumbbell bent over row": "dumbbell row",
  "overhead dumbbell press": "shoulder press",
  "dumbbell shoulder press": "shoulder press",
};

export async function generateAiPlan(params) {
  var duration = params?.duration;
  var equipment = Array.isArray(params?.equipment) ? params.equipment : [];
  var experienceLevel = params?.experienceLevel;
  var targetMuscle = params?.targetMuscle;
  var avoidExerciseNames = Array.isArray(params?.avoidExerciseNames) ? params.avoidExerciseNames : [];
  var onWarning = params?.onWarning;

  const plan = await generateWorkoutPlan(duration, equipment, targetMuscle, experienceLevel, avoidExerciseNames);
  const enrichedExercises = await Promise.all(
    plan.exercises.map(function enrichExerciseCB(exercise) {
      return enrichExercise(exercise, {
        equipment,
        targetMuscle,
        onWarning,
      });
    })
  );

  var now = Date.now();
  return {
    id: `${now}-${Math.floor(Math.random() * 1000000)}`,
    name: plan.name,
    createdAt: now,
    completedDates: [],
    exercises: enrichedExercises,
  };
}

async function enrichExercise(exercise, params) {
  try {
    const match = await findBestExerciseMatch(exercise);
    if (!match) {
      if (params.onWarning) {
        params.onWarning(`⚠️ Warning: Exercise "${exercise.displayName || exercise.name}" not found in database, showing un-enriched exercise.`);
      }
      return createFallbackExercise(exercise, params);
    }

    return normalizeExerciseFromDb(match, {
      name: exercise.name,
      displayName: exercise.displayName,
      searchName: exercise.searchName,
      targetMuscle: exercise.targetMuscle,
      equipment: exercise.equipment,
      sets: exercise.sets,
      reps: exercise.reps,
    });
  } catch {
    if (params.onWarning) {
      params.onWarning(`⚠️ Warning: Failed to load demo for "${exercise.displayName || exercise.name}", showing un-enriched exercise.`);
    }
    return createFallbackExercise(exercise, params);
  }
}

function createFallbackExercise(exercise, params) {
  return {
    id: `${exercise.name}-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
    exerciseDbId: "",
    name: exercise.displayName || exercise.name,
    searchName: exercise.searchName || exercise.name,
    targetMuscle: exercise.targetMuscle || params.targetMuscle,
    bodyPart: "",
    equipment: exercise.equipment || (params.equipment.length > 0 ? params.equipment[0] : "Bodyweight"),
    gifUrl: "",
    instructions: [],
    secondaryMuscles: [],
    description: "",
    difficulty: "",
    category: "",
    sets: exercise.sets,
    reps: exercise.reps,
  };
}

async function findBestExerciseMatch(exercise) {
  const queries = buildSearchQueries(exercise);
  const matchGroups = await Promise.all(queries.map(searchExercisesByName));
  const matches = mergeMatches(matchGroups);
  return selectBestExerciseMatch(matches, exercise, queries[0]);
}

function buildSearchQueries(exercise) {
  const queries = [];

  addSearchQuery(queries, exercise?.searchName);
  addSearchQuery(queries, exercise?.name);
  addSearchQuery(queries, exercise?.displayName);

  return queries.slice(0, 3);
}

function addSearchQuery(queries, value) {
  const normalized = normalizeSearchQuery(value);
  if (!normalized) {
    return;
  }

  pushUniqueQuery(queries, normalized);
  pushUniqueQuery(queries, SEARCH_QUERY_ALIASES[normalized]);

  const simplified = simplifySearchQuery(normalized);
  if (simplified !== normalized) {
    pushUniqueQuery(queries, simplified);
  }
}

function pushUniqueQuery(queries, value) {
  if (value && !queries.includes(value)) {
    queries.push(value);
  }
}

function normalizeSearchQuery(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[()]/g, " ")
    .replace(/[^a-z0-9+\-\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function simplifySearchQuery(query) {
  return query
    .replace(/\b(alternating|alternate|single arm|single-arm|one arm|one-arm|seated|standing|incline|decline|flat|supported|bodyweight|weighted|dumbbell|barbell|kettlebell|cable|machine|left|right)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function mergeMatches(matchGroups) {
  const matches = [];
  const seenKeys = new Set();

  matchGroups.forEach(function addMatchGroupCB(group) {
    if (!Array.isArray(group)) {
      return;
    }

    group.forEach(function addMatchCB(match) {
      const key = String(match?.id || match?.name || "").trim();
      if (!key || seenKeys.has(key)) {
        return;
      }

      seenKeys.add(key);
      matches.push(match);
    });
  });

  return matches;
}

function selectBestExerciseMatch(matches, exercise, primaryQuery) {
  if (!Array.isArray(matches) || matches.length === 0) {
    return null;
  }

  const targetName = normalizeSearchQuery(primaryQuery || exercise?.searchName || exercise?.name);
  const targetMuscle = normalizeSearchQuery(exercise?.targetMuscle);
  const targetEquipment = normalizeSearchQuery(exercise?.equipment);

  let bestMatch = matches[0];
  let bestScore = Number.NEGATIVE_INFINITY;

  matches.forEach(function scoreMatchCB(match) {
    const matchName = normalizeSearchQuery(match?.name);
    const matchTarget = normalizeSearchQuery(match?.target || match?.targetMuscle);
    const matchEquipment = normalizeSearchQuery(match?.equipment);
    let score = 0;

    if (matchName === targetName) {
      score += 8;
    } else if (matchName.startsWith(targetName) || targetName.startsWith(matchName)) {
      score += 5;
    } else if (matchName.includes(targetName) || targetName.includes(matchName)) {
      score += 3;
    }

    if (targetMuscle && matchTarget === targetMuscle) {
      score += 2;
    }

    if (targetEquipment && matchEquipment === targetEquipment) {
      score += 2;
    }

    if (match?.gifUrl || match?.imageUrl || match?.image) {
      score += 1;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = match;
    }
  });

  return bestMatch;
}
