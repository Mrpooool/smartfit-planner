// ExerciseDB via RapidAPI - provides exercise data and images.

const BASE_URL = "https://exercisedb.p.rapidapi.com";
const RAPIDAPI_KEY = process.env.EXPO_PUBLIC_RAPIDAPI_KEY;

const headers = {
  "X-RapidAPI-Key": RAPIDAPI_KEY,
  "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
};

const responseCache = new Map();
const inflightRequests = new Map();

const CACHE_TTL_MS = {
  searchExercisesByName: 10 * 60 * 1000,
  getExercisesByMuscle: 30 * 60 * 1000,
  getExerciseById: 24 * 60 * 60 * 1000,
  getTargetMuscleList: 24 * 60 * 60 * 1000,
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
  return fetchJsonWithCache(
    "searchExercisesByName",
    `${BASE_URL}/exercises/name/${encodeURIComponent(name.toLowerCase())}?offset=0&limit=5`,
    CACHE_TTL_MS.searchExercisesByName
  );
}

/**
 * Get exercises by body part for the Explorer screen.
 * @param {string} muscle - e.g. "chest", "back", "upper legs"
 * @returns {Promise<Object[]>}
 */
export async function getExercisesByMuscle(muscle) {
  return fetchJsonWithCache(
    "getExercisesByMuscle",
    `${BASE_URL}/exercises/bodyPart/${encodeURIComponent(muscle)}?offset=0&limit=20`,
    CACHE_TTL_MS.getExercisesByMuscle
  );
}

/**
 * Get one exercise detail by id.
 * @param {string} exerciseId
 * @returns {Promise<Object>}
 */
export async function getExerciseById(exerciseId) {
  return fetchJsonWithCache(
    "getExerciseById",
    `${BASE_URL}/exercises/exercise/${encodeURIComponent(exerciseId)}`,
    CACHE_TTL_MS.getExerciseById
  );
}

/**
 * Get all available target muscle group names.
 * @returns {Promise<string[]>}
 */
export async function getTargetMuscleList() {
  return fetchJsonWithCache(
    "getTargetMuscleList",
    `${BASE_URL}/exercises/targetList`,
    CACHE_TTL_MS.getTargetMuscleList
  );
}

export function clearExerciseDbCache() {
  responseCache.clear();
  inflightRequests.clear();
}

async function fetchJsonWithCache(scope, url, ttlMs) {
  const cacheKey = `${scope}:${url}`;
  const cachedEntry = responseCache.get(cacheKey);

  if (isCacheEntryValid(cachedEntry)) {
    return cachedEntry.data;
  }

  const inflightRequest = inflightRequests.get(cacheKey);
  if (inflightRequest) {
    return inflightRequest;
  }

  const request = fetch(url, { headers })
    .then(async function parseResponseCB(response) {
      if (!response.ok) {
        throw new Error(`ExerciseDB error: ${response.status}`);
      }

      const data = await response.json();
      responseCache.set(cacheKey, {
        data: data,
        expiresAt: Date.now() + ttlMs,
      });
      return data;
    })
    .finally(function cleanupInflightCB() {
      inflightRequests.delete(cacheKey);
    });

  inflightRequests.set(cacheKey, request);
  return request;
}

function isCacheEntryValid(cacheEntry) {
  return Boolean(cacheEntry && cacheEntry.expiresAt > Date.now());
}
