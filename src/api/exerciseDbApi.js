// ExerciseDB via RapidAPI - provides exercise data and images.

const BASE_URL = "https://exercisedb.p.rapidapi.com";
const RAPIDAPI_KEY = process.env.EXPO_PUBLIC_RAPIDAPI_KEY;

const headers = {
  "X-RapidAPI-Key": RAPIDAPI_KEY,
  "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
};

export function getExerciseImageSource(exerciseId, resolution) {
  return {
    uri: `${BASE_URL}/image?resolution=${resolution || 360}&exerciseId=${encodeURIComponent(exerciseId)}`,
    headers: headers,
  };
}

/**
 * Search exercises by name.
 * @param {string} name
 * @returns {Promise<Object[]>}
 */
export async function searchExercisesByName(name) {
  return fetchJson(`${BASE_URL}/exercises/name/${encodeURIComponent(name.toLowerCase())}?offset=0&limit=5`);
}

/**
 * Get exercises by body part for the Explorer screen.
 * @param {string} muscle - e.g. "chest", "back", "upper legs"
 * @returns {Promise<Object[]>}
 */
export async function getExercisesByMuscle(muscle) {
  return fetchJson(`${BASE_URL}/exercises/bodyPart/${encodeURIComponent(muscle)}?offset=0&limit=20`);
}

/**
 * Get one exercise detail by id.
 * @param {string} exerciseId
 * @returns {Promise<Object>}
 */
export async function getExerciseById(exerciseId) {
  return fetchJson(`${BASE_URL}/exercises/exercise/${encodeURIComponent(exerciseId)}`);
}

/**
 * Get all available target muscle group names.
 * @returns {Promise<string[]>}
 */
export async function getTargetMuscleList() {
  return fetchJson(`${BASE_URL}/exercises/targetList`);
}

export function clearExerciseDbCache() {
  // Response caching removed intentionally.
}

async function fetchJson(url) {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`ExerciseDB error: ${response.status}`);
  }
  return response.json();
}
