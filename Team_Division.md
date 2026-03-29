# SmartFit Planner — Team Division of Responsibilities

> **Last updated: 2026-03-27**

---

## Team Members

| Member | Canvas ID | Module |
|--------|-----------|--------|
| Muyang Huang  | 201175 | **Auth + Profile** |
| Yanjun Wang   | 198474 | **Smart Generator + Store Owner** |
| Zikang Song   | 198412 | **Exercise Explorer + Action Details** |
| Junhao Yang   | 198579 | **Plan Preview + Plan Management + Persistence** |

---

## Architecture Contract (Shared Rules)

All four members follow the same architectural constraints. Any PR that violates these rules must be corrected before merging.

| Layer | Rule |
|-------|------|
| **View** | Pure rendering only — accepts props, never imports a store or Firebase |
| **Presenter** | Wrapped with `observer`; reads from store, passes flat props to View |
| **Model (Store)** | Plain observable object; all mutations via `action`; no UI imports |
| **Persistence** | Only called from `reaction` / `flow` in the model layer; never from a Presenter or View |

**Naming convention:** All callbacks defined inside components end with `ACB` (e.g. `onLoginACB`).

---

## Member A — Auth + Profile

### Module Overview
Owns the complete login/register flow and the Profile tab, including future calendar and chart visualizations.

### Files Owned

| File | Status | Notes |
|------|--------|-------|
| `src/presenters/LoginPresenter.jsx` | ✅ Done | Calls `loginUser`; delegates all rendering to View |
| `src/presenters/RegisterPresenter.jsx` | ✅ Done | Calls `registerUser`; local loading state + error handling |
| `src/presenters/ProfilePresenter.jsx` | ✅ Done | Reads `planStore.savedPlans` + `userStore.email`; calls `logoutUser` |
| `src/views/LoginView.jsx` | ✅ Done | Email/password form with inline validation |
| `src/views/RegisterView.jsx` | ✅ Done | Registration form; error toast for duplicate accounts |
| `src/views/ProfileView.jsx` | ✅ Done | Saved plan list, logout button, placeholder sections for calendar/chart |
| `src/views/CalendarView.jsx` | ⏳ Pending | Placeholder created; needs `react-native-calendars` installed |
| `src/views/ChartView.jsx` | ⏳ Pending | Placeholder created; needs `react-native-chart-kit` installed |
| `app/login.jsx` | ✅ Done | Route entry → `LoginPresenter` |
| `app/register.jsx` | ✅ Done | Route entry → `RegisterPresenter` |
| `app/(tabs)/profile.jsx` | ✅ Done | Route entry → `ProfilePresenter` |

### Key Features Implemented
- **Login / Register**: email + password auth via Firebase; inline validation; error toast with user-friendly messages
- **Profile screen**: lists all saved plans; shows logged-in email; LOGOUT button triggers `logoutUser()` (Auth state change auto-clears `userStore`)
- **Plan deletion from Profile**: calls `planStore.removeSavedPlan(planId)` via callback

### Pending Tasks
- [ ] Install `react-native-calendars`; implement `CalendarView` reading `plan.completedDates`
- [ ] Install `react-native-chart-kit`; implement `ChartView` aggregating completedDates by week
- [ ] Wire `onStartPlan` callback in `ProfilePresenter` → `router.push('/details')` once Member D's details route is ready

### Dependencies
| Depends on | What is needed |
|------------|---------------|
| Member B (Store) | `userStore.email`, `userStore.uid` |
| Member D (Persistence) | `authRepo.logoutUser()` already implemented and shared |

---

## Member B — Smart Generator + Store Owner

### Module Overview
Owns the Home tab (AI plan generation flow) and is the **sole authority** on the MobX Store structure. Any Store contract change must go through a PR reviewed by at least one other member.

### Files Owned

| File | Status | Notes |
|------|--------|-------|
| `src/model/planStore.js` | ✅ Done | Full action set: `setCurrentPlan`, `setGeneratedPlan`, `addSavedPlan`, `updateSavedPlan`, `removeSavedPlan`, `markCompleted`, `updateExerciseField`, `renamePlan` |
| `src/model/userStore.js` | ✅ Done | `uid`, `email`, `ready`; `setUser` / `clearUser` actions |
| `src/api/glmApi.js` | ✅ Done | `generateWorkoutPlan(duration, equipment, targetMuscle)` → structured JSON |
| `src/api/exerciseDbApi.js` | ✅ Done | `searchExercisesByName`, `getExercisesByMuscle`, `getTargetMuscleList` |
| `src/utils/resolvePromise.js` | ✅ Done | Shared async state utility used by all presenters |
| `src/presenters/GeneratorPresenter.jsx` | ✅ Done | Form state via `useLocalObservable`; calls GLM → enriches via ExerciseDB; navigates to Plan Preview |
| `src/views/GeneratorView.jsx` | ✅ Done | Receives flat individual props (not a single `formParams` object); Skeleton UI during generation |
| `app/(tabs)/index.jsx` | ✅ Done | Route entry → `GeneratorPresenter` |
| `app/(tabs)/_layout.jsx` | ✅ Done | 4-tab layout: Home / Explore / Plan / Profile |
| `src/types/workout.js` | ✅ Done | Shared `WorkoutPlan` and `Exercise` JSDoc type definitions |

### Key Features Implemented
- **AI generation pipeline**: user inputs → `glmApi.generateWorkoutPlan` → `Promise.all` enrichment via `exerciseDbApi.searchExercisesByName` → `planStore.setGeneratedPlan` → auto-navigate to `/planPreview`
- **Graceful degradation**: if ExerciseDB lookup fails for an exercise, falls back to un-enriched exercise object and shows a warning toast via `uiStore`
- **Store contract**: all state mutations are centralized in `planStore.js`; `ready` flag gates rendering until Firestore data is loaded

### Pending Tasks
- [ ] Expand equipment filter options in `GeneratorView` (currently: None / Dumbbells / Bands / Full Gym)
- [ ] Consider adding a cancel/abort mechanism for in-flight GLM requests

### Dependencies
| Depends on | What is needed |
|------------|---------------|
| Member D (Persistence) | `planStore.ready` is set by `connectToPersistence`; generator should not allow actions until `ready === true` |

---

## Member C — Exercise Explorer + Action Details

### Module Overview
Owns the Explore tab (browsing and filtering ExerciseDB exercises) and the Action Details Stack page (individual exercise GIF view) used by both the Explorer and the Plan tabs.

### Files Owned

| File | Status | Notes |
|------|--------|-------|
| `src/presenters/ExplorerPresenter.jsx` | ✅ Done | Search + muscle filter + draft exercise list; `resolvePromise` for async state |
| `src/presenters/ActionDetailsPresenter.jsx` | ✅ Done | Reads exercise by index from route params (`source=generated` or `source=plan`) |
| `src/views/ExplorerView.jsx` | ✅ Done | Search bar, filter chips, results area, bottom draft-plan bar |
| `src/views/ExerciseCardView.jsx` | ✅ Done | GIF thumbnail + name + ADD / ADDED toggle button |
| `src/views/ActionDetailsView.jsx` | ✅ Done | Full GIF display + step-by-step instructions |
| `app/(tabs)/explore.jsx` | ✅ Done | Route entry → `ExplorerPresenter` |
| `app/action/[id].jsx` | ✅ Done | Route entry → `ActionDetailsPresenter` |

### Key Features Implemented
- **Exercise browsing**: fetches exercises by muscle group from ExerciseDB on filter change; uses `AsyncStateView` for loading / error / empty states
- **Search**: client-side name filter applied over the current muscle group's result set
- **Add / Added toggle**: maintains a local `draftExercises` array; toggling the same exercise removes it
- **Bottom bar**: shows count of selected exercises; "View / Save" button placeholder for future persistence integration
- **Action Details**: receives exercise index via route param; reads from either `planStore.generatedPlan` or `planStore.currentPlan` depending on `source` query param

### Pending Tasks
- [ ] Connect "View / Save" button in `ExplorerPresenter` → `planStore.addSavedPlan` to persist custom plans (coordinate with Member D on data shape)
- [ ] Extend muscle filter list beyond `["all", "chest", "upper legs", "back"]`

### Dependencies
| Depends on | What is needed |
|------------|---------------|
| Member B (Store) | `planStore.generatedPlan` and `planStore.currentPlan` for Action Details |
| Member D (Plan) | Needs agreement on custom plan data structure before wiring "View / Save" |

---

## Member D — Plan Preview + Plan Management + Persistence

### Module Overview
Owns the complete Firebase persistence layer, the Plan Preview Stack screen (shown immediately after AI generation), and the Plan tab (saved plan management). Also introduced the global Toast system used across the whole app.

### Files Owned

| File | Status | Notes |
|------|--------|-------|
| `src/persistence/firebaseConfig.js` | ✅ Done | Firebase initialization; reads 8 env vars from `.env.local` |
| `src/persistence/authRepo.js` | ✅ Done | `connectAuth`, `loginUser`, `registerUser`, `logoutUser` |
| `src/persistence/planRepo.js` | ✅ Done | `connectToPersistence(uid, reaction)` — `getDoc` initial load + `onSnapshot` live sync + `reaction` write-back; `applyRemote` flag prevents loops |
| `src/model/uiStore.js` | ✅ Done | Global Toast state: `showToast(message, type, duration)` |
| `src/presenters/PlanPresenter.jsx` | ✅ Done | Edit name/sets/reps; save to library; mark completed; delete with confirm dialog |
| `src/presenters/PlanPreviewPresenter.jsx` | ✅ Done | Reads `planStore.generatedPlan`; wraps `PlanView` in `previewMode`; ADD TO MY PLAN → `addSavedPlan` + redirect |
| `src/views/PlanView.jsx` | ✅ Done | Shared view for both Plan tab and Plan Preview; `previewMode` prop switches button set |
| `src/views/common/GlobalToast.jsx` | ✅ Done | Auto-subscribes to `uiStore`; renders success / warning / error toasts |
| `app/_layout.jsx` | ✅ Done | Root Stack layout; wires `connectAuth` + uid-reacting `connectToPersistence` / `disconnectFromPersistence` |
| `app/(tabs)/plan.jsx` | ✅ Done | Route entry → `PlanPresenter` |
| `app/planPreview.jsx` | ✅ Done | Route entry → `PlanPreviewPresenter` |
| `app/details.jsx` | ⏳ Stub | Route file created; Profile → plan details navigation pending |

### Key Features Implemented
- **Plan Preview flow**: `generatedPlan` → preview screen → user taps ADD → `addSavedPlan()` → success toast → redirect to Plan tab
- **Plan Management**: rename plan, edit sets/reps per exercise, mark today as completed (appends ISO date to `completedDates`), delete plan (confirmation dialog)
- **Firestore sync**: `connectToPersistence` uses `getDoc` for initial load, `onSnapshot` for live cross-device updates, and a `reaction` watching `JSON.stringify(savedPlans)` for write-back; `applyRemote` prevents the snapshot triggering another write
- **Global Toast**: `uiStore.showToast(message, type)` available to all presenters; auto-disappears after timeout

### Pending Tasks
- [ ] Complete `app/details.jsx` — wire Profile "START" → plan detail Stack navigation
- [ ] Integrate `CalendarView` and `ChartView` (blocked on Member A's `react-native-calendars` / `react-native-chart-kit` installs)
- [ ] Add Firestore Security Rules (users can only access their own `users/{uid}/data/plans` document)

### Dependencies
| Depends on | What is needed |
|------------|---------------|
| Member B (Store) | `planStore.savedPlans` and all actions must remain stable |
| Member A (Profile) | `onStartPlan` callback needs a target route once `details.jsx` is ready |
| Member C (Explorer) | Custom plan save flow needs agreement on exercise data shape |

---

## Cross-member Integration Checklist

| Item | Status | Owner |
|------|--------|-------|
| Store contract (planStore actions + userStore fields) stable | ✅ | B |
| Auth → uid → Firestore connection wired in `_layout.jsx` | ✅ | D |
| `resolvePromise` utility available to all presenters | ✅ | B |
| `GlobalToast` mounted in root layout | ✅ | D |
| Explorer "View / Save" → `addSavedPlan` persistence | ⏳ | C + D |
| Profile "START" → details route navigation | ⏳ | A + D |
| `react-native-calendars` install + `CalendarView` | ⏳ | A |
| `react-native-chart-kit` install + `ChartView` | ⏳ | A |
| End-to-end walkthrough: Login → Generate → Preview → Save → Mark Completed → Profile chart | ⏳ | All |
| Firestore Security Rules | ⏳ | D |
