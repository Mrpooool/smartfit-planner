# SmartFit Planner

**AI-powered workout planning and fitness tracking built with React Native and Expo.**

English | [简体中文](README-zh.md)

SmartFit Planner is a cross-platform mobile fitness application designed for users who want structured workout guidance without having to build every routine manually.

Users can generate personalized workout plans based on **training duration, available equipment, experience level, and target muscle groups**. AI-generated exercises are matched against ExerciseDB to enrich plans with real exercise metadata and visual demonstrations, while Firebase handles authentication and cloud persistence.

The app covers a complete workout workflow: **generate → preview → customize → save → train → track**.

## Features

### AI Workout Generation

Generate workout plans based on:

- Workout duration: 15 / 30 / 60 minutes
- Available equipment
- Experience level
- Target muscle groups

The generation pipeline uses the **GLM API** with structured JSON output constraints and validation to produce consistent workout plans.

Generated exercise names are normalized and matched against **ExerciseDB**, enriching the plan with real exercise information and visual demonstrations.

### Exercise Explorer

Browse and discover exercises from ExerciseDB:

- Search exercises by name
- Filter by body part
- View exercise details and demonstrations
- Add exercises to an existing workout plan
- Create custom plans directly from the exercise library

### Workout Plan Management

Users can:

- Preview AI-generated plans before saving
- Edit plan names
- Adjust sets and reps
- Add or remove exercises
- Create custom workout plans
- Save and delete plans
- Reuse previously saved routines

### Workout Timer & Training Flow

A built-in workout timer supports actual training sessions:

- Select a saved workout plan
- Progress through exercises and sets
- Track workout duration
- Mark completed workouts
- Record workout time and completion history

### Progress Tracking

The profile page provides a lightweight fitness dashboard with:

- Total workout count
- Weekly workout count
- Saved plan statistics
- Daily and total workout time
- Calendar-based workout history
- Exercise details for completed sessions

### Authentication & Cloud Sync

SmartFit Planner uses **Firebase Authentication** and **Cloud Firestore** for:

- User registration and login
- Password recovery
- User-specific workout data
- Saved workout plans
- Workout history
- Workout duration records
- Real-time synchronization across sessions

Each user's fitness data is stored independently using their Firebase UID.

## AI Generation Pipeline

The workout generation workflow contains several layers:

1. The user selects workout constraints such as duration, equipment, experience level, and muscle groups.
2. The app sends a structured request to the GLM model.
3. The model returns a validated JSON workout plan.
4. Exercise names are normalized for database lookup.
5. Multiple ExerciseDB search candidates are retrieved.
6. Candidates are ranked using exercise name, target muscle, and equipment matching.
7. Matching ExerciseDB metadata is merged into the generated plan.
8. The completed plan is presented for editing and saving.

If an exercise cannot be matched successfully, the application gracefully falls back to the original AI-generated exercise instead of failing the entire plan.

## Architecture

The application follows an **MVP-inspired architecture with MobX state management**.

- **Views** — React Native UI components responsible for rendering and user interaction
- **Presenters** — Coordinate user actions, routing, asynchronous operations, and application logic
- **MobX Stores** — Maintain workout plans, user state, UI state, workout history, and timers
- **API Layer** — Integrates the GLM API and ExerciseDB
- **Persistence Layer** — Handles Firebase Authentication and Firestore synchronization
- **Expo Router** — Provides file-based application routing and navigation

This separation keeps UI components relatively independent from API and persistence logic.

## Tech Stack

| Area | Technology |
| --- | --- |
| Mobile | React Native |
| Framework | Expo |
| Routing | Expo Router |
| State Management | MobX / mobx-react-lite |
| AI | GLM API |
| Exercise Data | ExerciseDB via RapidAPI |
| Authentication | Firebase Authentication |
| Database | Cloud Firestore |
| Testing | Jest |
| Language | JavaScript / JSX |

## Project Structure

- `app/` — Expo Router pages and navigation entries
- `src/presenters/` — Presenter and application flow logic
- `src/views/` — React Native UI components
- `src/model/` — MobX application stores
- `src/api/` — GLM and ExerciseDB API adapters
- `src/persistence/` — Firebase authentication and Firestore persistence
- `src/utils/` — AI plan enrichment and shared utilities
- `assets/` — Images, icons, and application assets

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and configure your Firebase project.

The application also requires:

```text
EXPO_PUBLIC_GLM_API_KEY=...
EXPO_PUBLIC_RAPIDAPI_KEY=...
```

### 3. Start the application

```bash
npm run expo
```

Scan the generated QR code using Expo Go, or run the application through an Android/iOS development environment.

## Development Commands

Run tests:

```bash
npm test
```

Run linting:

```bash
npm run lint
```

Start Expo:

```bash
npm run expo
```

## Motivation

Fitness beginners often know that they want to exercise but struggle with deciding **what exercises to perform, how much to train, and how to adapt a routine to their available time and equipment**.

SmartFit Planner explores how an LLM can be integrated into a practical mobile application while still using structured data, validation, external exercise databases, persistent user state, and conventional software architecture to build a complete product workflow.
