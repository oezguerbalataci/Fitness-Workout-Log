# 📱 Fitness Workout Log - Codebase Summary

## 🏗 Architecture Overview

The app follows a modern React Native architecture with Expo, focusing on performance, maintainability, and user experience.

### Key Components

1. **Templates**: Reusable workout templates
2. **Workouts**: Individual workout sessions
3. **Exercises**: Exercise definitions and tracking
4. **Timer**: Persistent workout timer with scroll animations

## 💾 State Management

### 1. **Workout Store (Zustand)**

- Manages templates, workouts, and exercise data
- Handles workout session state
- Persists data using MMKV storage

### 2. **Timer Store**

- Manages workout timer state
- Features:
  - Persistent timing across app restarts
  - Background state restoration
  - Scroll-based UI transitions
  - Compact floating mode

## 🔄 Data Flow

### 1. **Starting a Workout**

- User selects template
- System initializes:
  - Exercise sets
  - Timer state
  - Local input management

### 2. **During Workout**

- User interacts with exercise sets
- Timer persists and adapts UI:
  - Full view when scrolled to top
  - Compact floating view when scrolled down
- Real-time updates to:
  - Local state
  - Global store
  - Timer persistence

### 3. **Completing a Workout**

- Updates personal bests
- Saves workout history
- Cleans up timer and state

## 🎨 UI/UX Features

### 1. **Modern Design**

- Apple HIG compliance
- Smooth animations
- Dark/Light mode support
- Responsive layouts

### 2. **Interactive Elements**

- Animated transitions
- Haptic feedback
- Gesture support
- Scroll-based UI adaptations

### 3. **Timer Display**

- Dual-mode timer:
  - Full-size stationary view
  - Compact floating view
- Smooth transitions
- Persistent state
- Background time tracking

## 🚀 Recent Improvements

### 1. **Timer Enhancement**

- Added floating compact mode
- Improved state persistence
- Better scroll animations
- Background state handling

### 2. **UI Refinements**

- Enhanced exercise cards
- Better visual hierarchy
- Improved spacing and layout
- More consistent styling

### 3. **Performance**

- Optimized animations
- Better state management
- Reduced re-renders
- Smoother transitions

## 🔧 Technical Details

### 1. **State Persistence**

- MMKV for fast storage
- Zustand for state management
- Timer state restoration
- Exercise data persistence

### 2. **Animations**

- Reanimated 2 for smooth transitions
- Layout animations
- Scroll-based interactions
- Hardware acceleration

### 3. **Type Safety**

- Full TypeScript support
- Strict type checking
- Interface definitions
- Type inference

## 📝 Development Guidelines

### 1. **Code Style**

- Functional components
- Custom hooks
- TypeScript types
- Clean architecture

### 2. **Performance**

- Memoization
- Optimized re-renders
- Efficient animations
- State management

### 3. **Testing**

- Unit tests
- Integration tests
- E2E with Detox
- Performance monitoring

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

## 🚀 Key Changes

- **State Management**: Migrated from Redux to **Zustand** for simplicity and performance.
- **List Performance**: Implemented **FlashList** for faster rendering of long lists.
- **Dark Mode**: Added system-wide dark mode support using `useColorScheme` and `ThemeProvider`.
- **Performance Optimizations**:
  - Memoized components with `React.memo`.
  - Optimized handlers with `useCallback`.
  - Reduced unnecessary re-renders.
