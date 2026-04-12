# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

---

# SmartFit Planner Project Documentation

## Short Description of the Project

SmartFit Planner is a mobile fitness planning application built with Expo and React Native. It helps users explore exercises, generate workout plans with AI support, save and manage personal training plans, track completed workouts, and handle user authentication with Firebase.

## What We Have Done

- Built the app with Expo Router for navigation and a tab-based mobile interface.
- Implemented user authentication flows, including login, registration, and password reset.
- Added exercise exploration with filtering, searching, exercise detail pages, and image support.
- Implemented workout plan generation through the GLM API.
- Added plan preview, plan editing, saved plans, and workout completion tracking.
- Connected plan and auth data to Firebase persistence.
- Structured the app with a Presenter/View split and MobX stores for state management.
- Added basic automated tests for important presenter and persistence logic.

## What We Still Plan to Do

- Improve test coverage across more presenters, stores, and user flows.
- Refine UI/UX details, validation messages, loading states, and error handling.
- Expand the range of exercise filters and plan customization options.
- Improve generated-plan quality and make AI recommendations more flexible.
- Continue polishing profile features, history tracking, and long-term workout insights.
- Prepare the project for more complete deployment and production-level stability.

## Project File Structure

### Root Files

- `README.md`: Project readme; now includes the original Expo guide and this project documentation.
- `package.json`: Project metadata, scripts, dependencies, and development tools.
- `package-lock.json`: Locked dependency versions for reproducible installs.
- `app.json`: Expo app configuration.
- `babel.config.js`: Babel configuration for Expo/React Native.
- `eslint.config.js`: ESLint rules and linting setup.
- `firebase.json`: Firebase project configuration.
- `eas.json`: Expo Application Services build configuration.
- `tsconfig.json`: TypeScript configuration used for editor/tooling support.
- `Project_Proposal.md`: Early project proposal document.
- `Team_Division.md`: Team role/task division document.
- `成员D_职责分析.md`: Team member responsibility analysis document.
- `SmartFit Planner 开发规划.md`: Development planning document.

### App Routing (`app/`)

- `app/_layout.jsx`: Root router layout; initializes auth, persistence, and shared toast UI.
- `app/index.jsx`: Entry route for the app.
- `app/login.jsx`: Login page route.
- `app/register.jsx`: Registration page route.
- `app/forgot-password.jsx`: Password reset page route.
- `app/details.jsx`: Exercise details route.
- `app/planPreview.jsx`: Generated-plan preview route.
- `app/savedplans.jsx`: Saved plans page route.
- `app/action/[id].jsx`: Dynamic route for action/exercise detail pages.

### Tab Navigation (`app/(tabs)/`)

- `app/(tabs)/_layout.jsx`: Bottom-tab navigation layout and auth guard.
- `app/(tabs)/index.jsx`: Home tab route.
- `app/(tabs)/explore.jsx`: Explore tab route.
- `app/(tabs)/plan.jsx`: Plan tab route.
- `app/(tabs)/profile.jsx`: Profile tab route.

### Presenters (`src/presenters/`)

- `LoginPresenter.jsx`: Handles login page logic.
- `RegisterPresenter.jsx`: Handles registration page logic.
- `ForgotPasswordPresenter.jsx`: Handles password reset logic.
- `GeneratorPresenter.jsx`: Handles AI workout generation flow.
- `ExplorerPresenter.jsx`: Handles exercise browsing, search, filters, and add-to-plan actions.
- `ExploreDetailPresenter.jsx`: Handles detailed exercise/explore item logic.
- `ActionDetailsPresenter.jsx`: Handles action detail page behavior.
- `PlanPresenter.jsx`: Handles plan editing and management logic.
- `PlanPreviewPresenter.jsx`: Handles preview of generated plans before saving.
- `SavedPlansPresenter.jsx`: Handles saved plan listing and selection.
- `ProfilePresenter.jsx`: Handles profile page logic.
- `__tests__/DetailsPresenter.test.js`: Test file for presenter detail behavior.

### Views (`src/views/`)

- `LoginView.jsx`: UI for the login screen.
- `RegisterView.jsx`: UI for the registration screen.
- `ForgotPasswordView.jsx`: UI for the password reset screen.
- `GeneratorView.jsx`: UI for generating workout plans.
- `ExplorerView.jsx`: UI for the exercise explorer page.
- `ExerciseCardView.jsx`: Reusable exercise card component.
- `ActionDetailsView.jsx`: UI for detailed action/exercise information.
- `PlanView.jsx`: Main UI for viewing and editing a workout plan.
- `PlanDirectoryView.jsx`: UI for browsing available plans or plan lists.
- `SavedPlansView.jsx`: UI for saved plans.
- `ProfileView.jsx`: UI for the profile screen.
- `CalendarView.jsx`: Calendar component for workout tracking/history.
- `ChartView.jsx`: Chart component for visual fitness/workout information.
- `AddToPlanModal.jsx`: Modal UI for adding an exercise to a plan.
- `common/AsyncStateView.jsx`: Shared loading/error/empty-state wrapper.
- `common/ExerciseImage.jsx`: Shared exercise image component.
- `common/GlobalToast.jsx`: Shared global toast/notification component.

### Models (`src/model/`)

- `planStore.js`: MobX store for current plans, generated plans, saved plans, and editing actions.
- `uiStore.js`: MobX store for UI state such as toast messages.
- `userStore.js`: MobX store for user/session state.

### Persistence (`src/persistence/`)

- `firebaseConfig.js`: Firebase app configuration and initialization.
- `authRepo.js`: Authentication connection logic for Firebase Auth.
- `planRepo.js`: Plan persistence logic for Firestore/database syncing.
- `__tests__/planRepo.test.js`: Test file for plan repository behavior.

### APIs (`src/api/`)

- `exerciseDbApi.js`: API adapter for fetching exercise data from the exercise database.
- `glmApi.js`: API adapter for generating workout plans with the GLM model.

### Utilities and Types (`src/utils/`, `src/types/`)

- `normalizeExercise.js`: Helper for normalizing exercise data into app format.
- `resolvePromise.js`: Helper for tracking promise state in presenters.
- `workout.js`: Shared workout-related type definitions/documentation.

### Shared Styling

- `src/theme.js`: Shared theme values such as colors and styling constants.

### Assets (`assets/images/`)

- `Background.png`: Main background image asset.
- `StockCake-Dance_Through_Light-1538690-medium.jpg`: Visual asset used in the app.
- `StockCake-Strength_Meets_Grace-1515373-medium.jpg`: Visual asset used in the app.
- `StockCake-Strength_Meets_Grace-1515373-standard.jpg`: Alternative visual asset.
- `icon.png`: Main app icon.
- `favicon.png`: Web favicon.
- `splash-icon.png`: Splash screen icon.
- `android-icon-background.png`: Android adaptive icon background.
- `android-icon-foreground.png`: Android adaptive icon foreground.
- `android-icon-monochrome.png`: Android monochrome icon.
- `partial-react-logo.png`: Default Expo/React image asset.
- `react-logo.png`: Default Expo/React image asset.
- `react-logo@2x.png`: High-resolution Expo/React image asset.
- `react-logo@3x.png`: High-resolution Expo/React image asset.
