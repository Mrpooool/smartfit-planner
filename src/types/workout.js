/**
 * @typedef {Object} Exercise
 * @property {string} id                - Local or ExerciseDB unique ID
 * @property {string} exerciseDbId      - ExerciseDB unique ID when available
 * @property {string} name              - Exercise display name (e.g. "Push-up")
 * @property {string} searchName        - Normalized lookup name used for database search
 * @property {string} targetMuscle      - Primary muscle group (e.g. "chest")
 * @property {string} bodyPart          - Broad body-part category from ExerciseDB
 * @property {string} equipment         - Required equipment name
 * @property {string} gifUrl            - URL to exercise demonstration GIF
 * @property {string[]|string} instructions - Step-by-step instructions
 * @property {number} sets              - Number of sets
 * @property {number} reps              - Number of reps per set
 */

/**
 * @typedef {Object} WorkoutPlan
 * @property {string}     id             - Unique plan ID
 * @property {string}     name           - User-defined plan name
 * @property {Exercise[]} exercises      - List of exercises in the plan
 * @property {number}     createdAt      - Unix timestamp of creation
 * @property {string[]}   completedDates - ISO date strings of completed workouts (e.g. "2026-03-22")
 */

// No runtime exports — this file is JSDoc type documentation only.
// Reference in other files via: /** @type {import('../types/workout').WorkoutPlan} */
