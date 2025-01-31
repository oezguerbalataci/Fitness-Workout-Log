# Codebase Summary

## 🗂️ Project Structure

```
src/
├── components/ # Reusable UI components
│ ├── active/ # Components for the active workout screen
│ │ ├── AddExerciseModal.tsx # Modal to add exercises to a workout
│ │ ├── ExerciseCard.tsx # Card for displaying an exercise and its sets
│ │ ├── ExerciseList.tsx # List of ExerciseCards
│ │ ├── ExerciseListHeader.tsx# Header for the ExerciseList
│ │ ├── QuitWorkoutDialog.tsx # Dialog to confirm quitting a workout
│ │ ├── WorkoutHeader.tsx # Header for the workout screen
│ │ ├── WorkoutNotFound.tsx # Displayed when a workout isn't found
│ │ ├── WorkoutSet.tsx # Component for a single set in an exercise
│ │ ├── WorkoutTimerSection.tsx# Section displaying the workout timer
│ │ └── utils/ # Utility functions for active workout components
│ ├── home/ # Components for the home screen (templates)
│ │ ├── EmptyState.tsx # Displayed when no templates exist
│ │ ├── Header.tsx # Header for the home screen
│ │ ├── NewTemplateButton.tsx # Button to create a new template
│ │ └── TemplateList.tsx # List of workout templates
│ ├── profile/ # Components for the profile screen
│ │ ├── PersonalRecords.tsx # Displays personal workout records
│ │ ├── ProfileHeader.tsx # Header for the profile screen
│ │ ├── StatsOverview.tsx # Overview of workout statistics
│ │ └── ThemeToggle.tsx # Switch to toggle dark/light mode
│ ├── providers/ # Context providers
│ │ └── ThemeProvider.tsx # Provides theme context to the app
│ ├── shared/ # Shared components
│ │ └── Text.tsx # Reusable Text component with variants
│ └── index.ts # Exports all components for easy import
├── store/ # State management using Zustand
│ ├── themeStore.ts # Zustand store for theme management
│ ├── timerStore.ts # Zustand store for workout timer
│ └── workoutStore.ts # Zustand store for workout data
├── theme/ # Theme definitions
│ ├── colors.ts # Color palette
│ └── fonts.ts # Font definitions
└── utils/ # Utility functions
└── index.ts # Exports all utility functions

app/ # Expo Router file-based routing
├── (tabs)/ # Bottom tab navigation screens
│ ├── _layout.tsx # Tab navigation configuration
│ ├── index.tsx # Home screen (templates)
│ ├── create.tsx # Create workout screen
│ ├── logs.tsx # Workout history screen
│ └── profile.tsx # User profile screen
├── (modals)/ # Modal screens
│ ├── _layout.tsx # Modal navigation configuration
│ ├── complete.tsx # Workout completion modal
│ └── exercise/ # Exercise-related modals
├── template/ # Template-related screens
│ ├── [id].tsx # Template detail screen
│ ├── new.tsx # New template screen
│ └── edit/ # Template editing screens
└── workout/ # Workout-related screens
└── active.tsx # Active workout screen

lib/ # Core utilities and configurations
├── constants.ts # App-wide constants and themes
├── useColorScheme.tsx # Color scheme hook for dark/light mode
├── android-navigation-bar.ts # Android navigation bar utilities
├── utils.ts # Core utility functions
└── icons/ # Icon components
└── iconWithClassName.ts # Icon utility functions
```

## 📂 Directory Breakdown

- **`components/active`**: Components for the active workout screen (e.g., exercise tracking, timers).
- **`components/home`**: Components for the home screen (e.g., templates, empty states).
- **`components/profile`**: Components for the profile screen (e.g., personal records, stats).
- **`components/providers`**: Context providers (e.g., theme management).
- **`components/shared`**: Shared UI components (e.g., `Text` component).
- **`store`**: Zustand stores for state management (e.g., workout, timer, theme).
- **`theme`**: Theme definitions (e.g., colors, fonts).
- **`utils`**: Utility functions (e.g., initialization, input handling).
- **`app`**: File-based routing using Expo Router (e.g., tabs, modals, screens).
- **`lib`**: Core utilities and configurations (e.g., themes, hooks, icons).

## 🔄 Data Flow

### 1. **Starting a Workout**

- User selects a template in `TemplateList`.
- Navigates to `WorkoutScreen` using `expo-router`.
- `WorkoutScreen` initializes state from `workoutStore`.

### 2. **During a Workout (Exercise Set Input)**

- User interacts with `WorkoutSet` components in `ExerciseCard`.
- Input changes update:
  - Local state in `ExerciseCard`.
  - Global state in `workoutStore` (via Zustand).

### 3. **Completing a Workout**

- User clicks "Complete" in `WorkoutHeader`.
- `handleComplete` (in `utils`) performs:
  - Updates personal bests in `workoutStore`.
  - Marks workout as completed.
  - Navigates to logs screen.

### 4. **Leaving a Workout**

- User clicks "Close" in `WorkoutHeader`.
- `handleLeaveWorkout` (in `utils`) performs:
  - Stops and resets the timer.
  - Clears workout state (without saving).
  - Navigates back to templates.

## 🚀 Key Changes

- **State Management**: Migrated from Redux to **Zustand** for simplicity and performance.
- **List Performance**: Implemented **FlashList** for faster rendering of long lists.
- **Dark Mode**: Added system-wide dark mode support using `useColorScheme` and `ThemeProvider`.
- **Performance Optimizations**:
  - Memoized components with `React.memo`.
  - Optimized handlers with `useCallback`.
  - Reduced unnecessary re-renders.
