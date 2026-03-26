// ExerciseDB via RapidAPI — provides GIFs, muscle group data, and exercise details.
// TODO: Replace with your own key from https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb

const BASE_URL = "https://exercisedb.p.rapidapi.com";
const RAPIDAPI_KEY = process.env.EXPO_PUBLIC_RAPIDAPI_KEY;

const headers = {
  "X-RapidAPI-Key": RAPIDAPI_KEY,
  "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
};

/**
 * Search exercises by name — used to enrich GLM output with GIFs.
 * @param {string} name
 * @returns {Promise<Object[]>}
 */
export async function searchExercisesByName(name) {
  const response = await fetch(
    `${BASE_URL}/exercises/name/${encodeURIComponent(name.toLowerCase())}?offset=0&limit=5`,
    { headers }
  );
  if (!response.ok) throw new Error(`ExerciseDB error: ${response.status}`);
  return response.json();
}

/**
 * Get exercises by target muscle group — used in the Explorer screen.
 * @param {string} muscle - e.g. "chest", "back", "upper legs"
 * @returns {Promise<Object[]>}
 */
export async function getExercisesByMuscle(muscle) {
  const response = await fetch(
    `${BASE_URL}/exercises/bodyPart/${encodeURIComponent(muscle)}?offset=0&limit=20`,
    { headers }
  );
  if (!response.ok) throw new Error(`ExerciseDB error: ${response.status}`);
  return response.json();
}

/**
 * Get all available target muscle group names — used to populate filter chips.
 * @returns {Promise<string[]>}
 */
export async function getTargetMuscleList() {
  const response = await fetch(`${BASE_URL}/exercises/targetList`, { headers });
  if (!response.ok) throw new Error(`ExerciseDB error: ${response.status}`);
  return response.json();
}
