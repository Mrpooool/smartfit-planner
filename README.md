# SmartFit Planner

SmartFit Planner is a mobile fitness planning app built with Expo and React Native. It helps users browse exercises, generate workout plans, save and edit plans, track completed workouts, and manage their account data.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the Expo development server:

   ```bash
   npm run expo
   ```

3. Scan the QR code shown in the terminal with the Expo Go app on your phone.

   This is the easiest way to run the app. Make sure your phone has Expo Go installed before scanning the QR code.

## Useful Commands

```bash
npm test
```

Runs the Jest test suite.

```bash
npm run lint
```

Runs Expo's linting command.

## Project Structure

- `app/`: Expo Router routes and navigation layouts.
- `src/presenters/`: Presenter logic for screens and user flows.
- `src/views/`: React Native UI components.
- `src/model/`: MobX stores for plan, user, and UI state.
- `src/persistence/`: Firebase authentication and plan persistence code.
- `src/api/`: API adapters for exercise data and AI workout generation.
- `src/utils/`: Shared helper functions.
- `src/theme.js`: Shared colors, spacing, typography, and style constants.
- `assets/`: App images and icons.

## Third-Party User-Visible Components

The main third-party user-visible component used in this project is the calendar on the Profile screen:

- Library: `react-native-calendars`
- Used in: `src/views/CalendarView.jsx`
- Displayed through: `src/views/ProfileView.jsx`, under the "Workout Calendar" section
- Purpose: shows a calendar where completed workout dates are highlighted and users can select a date to view workout history for that day

The dependency is listed in `package.json`:

```json
"react-native-calendars": "^1.1314.0"
```

## Main Features

- Login, registration, logout, and password reset flows.
- Exercise browsing with search, filters, detail pages, and image previews.
- AI-supported workout plan generation.
- Plan preview, saving, editing, and completion tracking.
- Profile page with workout statistics and calendar-based workout history.
- Firebase-backed authentication and plan persistence.
