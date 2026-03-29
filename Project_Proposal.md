# Project Proposal: SmartFit Planner
### (Native Application)

---

## Team Members & Canvas IDs

- Muyang Huang — 201175
- Yanjun Wang — 198474
- Zikang Song — 198412
- Junhao Yang — 198579

---

## App Name

**SmartFit Planner**

---

## Short Description

SmartFit Planner is a React Native app that turns static exercise data into personalized fitness routines. Instead of overwhelming users with a huge database, it uses AI to generate custom plans based on available equipment, time constraints, and target muscle groups. Users can preview and save AI-generated plans, explore the full exercise library, track daily workouts on a calendar, and visualize consistency through weekly charts. All data is synced in real time across devices via Firestore.

---

## Target Audience

SmartFit Planner is built primarily for **fitness beginners** — people who want to start working out but do not know where to begin. More specifically, the app addresses:

- **Budget-constrained users** who cannot afford a personal trainer and need an accessible, low-cost alternative for structured guidance.
- **Home or minimal-equipment exercisers** who work out without a full gym setup (bodyweight only, resistance bands, or a pair of dumbbells).
- **Busy individuals** with limited time who need short, focused sessions (15–30 minutes) rather than lengthy gym programs.
- **Self-starters who feel overwhelmed** by the sheer number of exercises online and need a curated starting point rather than an open-ended database.

The AI-powered generator removes the most common barrier for beginners — *"I don't know what to do"* — by producing a ready-to-follow plan in seconds based on the user's actual constraints. Animated exercise GIFs and step-by-step instructions further lower the learning curve, replacing the coaching role a personal trainer would otherwise fill.

---

## Frameworks Used

- **React Native (Expo)**: Core cross-platform mobile framework.
- **MobX**: Global state management via POJO model + MVP architecture. All state changes go through actions; async operations use `flow`.
- **Firebase**: Email/Password authentication (Firebase Auth) and Firestore persistence with real-time `onSnapshot` synchronization.
- **Expo Router**: File-system based routing handling Tab navigation (Home / Explore / Plan / Profile) and Stack pages (Login, Plan Preview, Action Details).

---

## APIs Used

1. **ExerciseDB (via RapidAPI)**: Provides the full exercise library — movement names, target muscle groups, equipment types, and animated instructional GIF URLs.
2. **GLM-4.7-flash API (Zhipu AI)**: AI reasoning engine that synthesizes a structured JSON training plan from user inputs (available time, equipment, target muscle group).

---

## Data Breakdown

### From APIs

- **Exercise Library**: Movement names, target muscle groups, and equipment types (ExerciseDB).
- **Visual Content**: Animated GIF URLs for each exercise (ExerciseDB).
- **Generated Plans**: Structured JSON containing an ordered exercise list with sets and reps, produced by GLM-4.7-flash from user-supplied conditions.

### App-Specific Data (Persisted in Firestore)

- **Saved Plans**: Each plan object stores: `name` (string), `exercises` array (name, gifUrl, targetMuscle, equipment, sets, reps), and `completedDates` (ISO-date string array).
- **Check-in History**: ISO date strings appended to each plan's `completedDates` on Mark as Completed; consumed by the calendar and weekly chart in the Profile screen.
- **Auth State**: Unique user UID and email managed by Firebase Auth; UID is used as the Firestore document key to isolate data per user.

---

## Screen Mock-ups

The app has **4 Tab screens** (Home, Explore, Plan, Profile) and **3 Stack screens** (Login/Register, Plan Preview, Action Details).

---

### 1. Login / Register (Stack)

- Email and password text inputs with inline format/length validation.
- LOGIN / REGISTER button shows a loading spinner on submit; error toast for wrong credentials.
- Toggle link to switch between Login and Register screens.

```
+-----------------------------------+
|        SmartFit Planner           |
|                                   |
|  [  Email address              ]  |
|  [  Password                   ]  |
|                                   |
|  [       LOGIN / REGISTER      ]  |
|                                   |
|  Don't have an account? Register  |
+-----------------------------------+
```

---

### 2. Smart Generator — Home Tab

- Welcome header showing the logged-in user's email.
- Three condition selectors: Available Time (15 / 30 / 60 min radio), Equipment (None / Dumbbells / Bands / Full Gym checkboxes), Target Muscle Group (Picker dropdown — `@react-native-picker/picker`).
- GENERATE SMART PLAN button: disables on tap, shows Skeleton UI while awaiting GLM-4.7-flash response; on success auto-navigates to Plan Preview.

```
+-----------------------------------+
|  Hi, Alex!                        |
|  SMART PLAN GENERATOR             |
|                                   |
|  Time:  (o)15  ( )30  ( )60 min  |
|  Equip: [x]None  [ ]Dumbbells    |
|  Muscle: [ Full Body v ]          |
|                                   |
|  [   GENERATE SMART PLAN   ]      |
|  (button disabled + skeleton      |
|   while AI is working)            |
|  -------------------------------- |
|  Home | Explore | Plan | Profile  |
+-----------------------------------+
```

---

### 3. Plan Preview — Stack Screen

- Appears immediately after AI generation; shows the generated plan before saving.
- Editable plan name field at the top.
- Scrollable exercise list: animated GIF thumbnail, exercise name, target muscle, equipment, editable Sets / Reps fields.
- Tap any exercise row to navigate to Action Details.
- ADD TO MY PLAN button: calls `addSavedPlan()`, shows success toast, redirects to Plan tab.

```
+-----------------------------------+
|  <- Back     AI Generated Plan    |
|                                   |
|  Plan Name  [ 30-Min Full Body ]  |
|                                   |
|  1. Push-ups                      |
|     [GIF]  Chest | None           |
|     Sets [3]  Reps [12]     -->   |
|                                   |
|  2. Bodyweight Squats             |
|     [GIF]  Legs | None            |
|     Sets [3]  Reps [15]     -->   |
|                                   |
|  [     +  ADD TO MY PLAN   ]      |
+-----------------------------------+
```

---

### 4. Plan Tab — Manage Saved Plans

- Editable plan name, exercise list with sets/reps inputs.
- SAVE PLAN TO LIBRARY — writes to Firestore via MobX `reaction`.
- MARK AS COMPLETED — appends today's ISO date to `completedDates`.
- DELETE PLAN — requires confirmation dialog before removal.
- Tap an exercise row to open the Action Details Stack page.

```
+-----------------------------------+
|  Plan Name  [ My Push Day      ]  |
|                                   |
|  1. Push-ups                [ > ] |
|     Sets [3]  Reps [12]           |
|  2. Bodyweight Squats       [ > ] |
|     Sets [3]  Reps [15]           |
|                                   |
|  [ SAVE PLAN TO LIBRARY    ]      |
|  [ MARK AS COMPLETED       ]      |
|  [ Delete Plan (confirm)   ]      |
|  -------------------------------- |
|  Home | Explore | Plan | Profile  |
+-----------------------------------+
```

---

### 5. Action Details — Stack Screen

- Full-screen animated GIF of the exercise (from ExerciseDB).
- Exercise name, target muscle group, equipment required.
- Scrollable numbered instructions.
- Back navigation returns to Plan Preview or Plan Tab depending on source.

```
+-----------------------------------+
|  <- Back     Action Details       |
|                                   |
|  Push-ups                         |
|  [ ===  Exercise GIF  ===== ]     |
|                                   |
|  Target: Chest  |  Equip: None    |
|                                   |
|  Instructions:                    |
|  1. Keep core tight...            |
|  2. Lower chest to floor...       |
|  3. Push back up...               |
+-----------------------------------+
```

---

### 6. Exercise Explorer — Explore Tab

- Search bar for filtering exercises by name.
- Muscle-group filter chips (All / Chest / Legs / Back / …).
- Scrollable exercise cards: GIF thumbnail, name, target muscle, ADD button.
- ADD toggles to ADDED; bottom bar counts selected exercises and provides a View / Save button to build a custom plan.

```
+-----------------------------------+
|  Explore Exercises                |
|  [ Search...                   ] |
|  [All] [Chest] [Legs] [Back]...   |
|                                   |
|  [GIF]  Push-up   Chest  [+ Add] |
|  [GIF]  Squat     Legs   [+ Add] |
|  [GIF]  Pull-up   Back   [+ Add] |
|                                   |
|  Custom Plan: 2 exercises         |
|  [        View / Save       ]     |
|  -------------------------------- |
|  Home | Explore | Plan | Profile  |
+-----------------------------------+
```

---

### 7. Profile / Progress — Profile Tab

- Lists all saved plans; START button loads a plan into the Plan tab.
- Visual calendar (`react-native-calendars`) with completed workout dates highlighted.
- Weekly bar chart (`react-native-chart-kit`) showing workouts per week.
- LOGOUT button signs out and disconnects the Firestore listener.

```
+-----------------------------------+
|  Profile & Progress               |
|                                   |
|  My Saved Plans:                  |
|  * 30-Min Full Body   [ START ]   |
|  * My Push Day        [ START ]   |
|                                   |
|  [ react-native-calendars       ] |
|    (completed dates highlighted)  |
|                                   |
|  [ react-native-chart-kit       ] |
|    Wk1  Wk2  Wk3  Wk4            |
|    [##] [##] [#]  [###]           |
|                                   |
|  [          LOGOUT          ]     |
|  -------------------------------- |
|  Home | Explore | Plan | Profile  |
+-----------------------------------+
```

---

## Technical Strategy

- **Architecture (MVP + MobX)**: Business logic is fully separated from UI via the Model-View-Presenter pattern. All Views are pure rendering components accepting only props; Presenters use MobX `observer` to react to Store changes. No View imports Firebase or a Store directly.
- **System Status (resolvePromise)**: A custom `resolvePromise` utility wraps all async API calls, exposing `loading / error / data` states that drive Skeleton UI and error toasts without placing any async logic inside Views.
- **Real-time Persistence (onSnapshot + reaction)**: `connectToPersistence(uid)` subscribes to the user's Firestore document via `onSnapshot` for live reads. A MobX `reaction` watches `savedPlans` and calls `setDoc` on any change, with an `applyRemote` flag preventing write-back loops. The listener is cleanly disconnected on logout.
- **Third-party UI Components**: `@react-native-picker/picker` (muscle selector — integrated); `react-native-calendars` (check-in calendar — pending install); `react-native-chart-kit` (weekly chart — pending install).
