import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import {
  useWorkoutStore,
  LogExercise,
  Exercise,
} from "../../src/store/workoutStore";
import { useThemeStore } from "../../src/store/themeStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Header } from "../../src/components/ui/Header";
import { WorkoutTimer } from "../../src/components/workout/WorkoutTimer";
import { useTimerStore } from "../../src/store/timerStore";
import { WorkoutNotFound } from "../../src/components/active/WorkoutNotFound";
import Animated, {
  FadeOut,
  Layout,
  SlideOutRight,
  ZoomOut,
  FadeIn,
  runOnJS,
  SlideInRight,
  BounceIn,
  Easing,
  withSpring,
  withTiming,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { WorkoutSet } from "../../src/components/active/WorkoutSet";
import { ExerciseCard } from "../../src/components/active/ExerciseCard";
import { WorkoutHeader } from "../../src/components/active/WorkoutHeader";
import { findExerciseFromTemplate } from "../../src/components/active/utils/exerciseUtils";
import {
  handleInputChange,
  handleInputBlur,
  handleAddSet,
  handleRemoveSet,
} from "../../src/components/active/utils/setUtils";
import {
  handleComplete as handleWorkoutComplete,
  handleLeaveWorkout as handleWorkoutLeave,
  handleRemoveExercise as handleWorkoutRemoveExercise,
} from "../../src/components/active/utils/workoutUtils";
import {
  initializeExerciseSets,
  initializeLocalInputs,
  initializeTimer,
} from "../../src/components/active/utils/initUtils";
import { ExerciseListHeader } from "../../src/components/active/ExerciseListHeader";
import { WorkoutTimerSection } from "../../src/components/active/WorkoutTimerSection";
import { ExerciseList } from "../../src/components/active/ExerciseList";
import { exercises as defaultExercises } from "../../src/data/exercises";
import { QuitWorkoutDialog } from "../../src/components/active/QuitWorkoutDialog";

interface SetData {
  weight: number;
  reps: number;
  rpe?: number;
}

export default function ActiveWorkoutScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { templateId, workoutId } = useLocalSearchParams<{
    templateId: string;
    workoutId: string;
  }>();
  const { startTimer, stopTimer, resetTimer, checkAndRestoreTimer } =
    useTimerStore();

  const template = useWorkoutStore((state) =>
    state.templates.find((t) => t.id === templateId)
  );
  const workout = template?.workouts.find((w) => w.id === workoutId);
  const currentWorkout = useWorkoutStore((state) => state.currentWorkout);
  const customExercises = useWorkoutStore((state) => state.customExercises);
  const allExercises = [...defaultExercises, ...customExercises];

  const scale = useSharedValue(1);
  const pressScale = useSharedValue(1);
  const scrollY = useSharedValue(0);
  const headerHeight = insets.top; // Height at which timer should be fully transitioned

  // Create active exercises directly from currentWorkout.exerciseData
  const activeExercises = currentWorkout?.exerciseData
    ? Object.entries(currentWorkout.exerciseData).map(([id, data]) => ({
        id,
        name: data.name,
        bodyPart: data.bodyPart,
        sets: data.sets,
        reps: data.reps,
      }))
    : [];

  const [exerciseSets, setExerciseSets] = useState<Record<string, SetData[]>>(
    {}
  );
  const [localInputs, setLocalInputs] = useState<
    Record<
      string,
      Record<number, { weight: string; reps: string; rpe: string }>
    >
  >({});
  const [showQuitDialog, setShowQuitDialog] = useState(false);
  const [removingSet, setRemovingSet] = useState<{
    exerciseId: string;
    setIndex: number;
  } | null>(null);

  // Cleanup function for unmounting
  useEffect(() => {
    return () => {
      // Reset local state
      setExerciseSets({});
      setLocalInputs({});
      setShowQuitDialog(false);
    };
  }, []);

  // Initialize exercise sets from current workout if it exists
  useEffect(() => {
    if (currentWorkout) {
      // Use all exercises from currentWorkout
      const filteredSets: Record<string, SetData[]> = {};
      Object.entries(currentWorkout.exercises).forEach(([exerciseId, sets]) => {
        filteredSets[exerciseId] = sets;
      });
      setExerciseSets(filteredSets);
    } else if (workout) {
      const initialSets: Record<string, SetData[]> = {};
      workout.exercises.forEach((exercise) => {
        initialSets[exercise.id] = Array(exercise.sets)
          .fill(null)
          .map(() => ({ weight: 0, reps: exercise.reps, rpe: 0 }));
      });
      setExerciseSets(initialSets);
    }

    // Cleanup function
    return () => {
      setExerciseSets({});
    };
  }, [currentWorkout, workout]);

  // Initialize local inputs from exerciseSets
  useEffect(() => {
    setLocalInputs(initializeLocalInputs(exerciseSets));

    // Cleanup function
    return () => {
      setLocalInputs({});
    };
  }, [exerciseSets]);

  // Start timer when component mounts, but only if there isn't one already running
  useEffect(() => {
    // Only initialize if we have a current workout
    if (currentWorkout) {
      initializeTimer();
    }
    return () => {
      // No cleanup needed - timer should persist
    };
  }, [currentWorkout]);

  const handleSetInputChange = useCallback(
    (
      exerciseId: string,
      setIndex: number,
      field: "weight" | "reps" | "rpe",
      value: string
    ) => {
      handleInputChange(exerciseId, setIndex, field, value, setLocalInputs);
    },
    []
  );

  const handleSetInputBlur = useCallback(
    (
      exerciseId: string,
      setIndex: number,
      field: "weight" | "reps" | "rpe",
      value: string
    ) => {
      handleInputBlur(
        exerciseId,
        setIndex,
        field,
        value,
        setExerciseSets,
        currentWorkout,
        templateId,
        workoutId
      );
    },
    [currentWorkout, templateId, workoutId]
  );

  const handleSetAdd = useCallback(
    (exerciseId: string) => {
      if (workout) {
        handleAddSet(
          exerciseId,
          exerciseSets,
          workout,
          setExerciseSets,
          setLocalInputs,
          currentWorkout,
          templateId,
          workoutId
        );
      }
    },
    [workout, exerciseSets, currentWorkout, templateId, workoutId]
  );

  const handleSetRemove = useCallback(
    (exerciseId: string, setIndex: number) => {
      handleRemoveSet(
        exerciseId,
        setIndex,
        setExerciseSets,
        currentWorkout,
        templateId,
        workoutId,
        setLocalInputs
      );
    },
    [currentWorkout, templateId, workoutId]
  );

  const handleComplete = useCallback(() => {
    if (!template || !workout) return;
    handleWorkoutComplete(exerciseSets, template, workout, router);
  }, [exerciseSets, template, workout, router]);

  const handleLeaveWorkout = useCallback(() => {
    setShowQuitDialog(true);
  }, []);

  const handleConfirmQuit = useCallback(() => {
    setShowQuitDialog(false);
    handleWorkoutLeave(router);
  }, [router]);

  const handleRemoveExercise = useCallback((exerciseId: string) => {
    // Remove from workout store and local state
    handleWorkoutRemoveExercise(exerciseId, setExerciseSets, setLocalInputs);
  }, []);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollY.value = event.nativeEvent.contentOffset.y;
    },
    []
  );

  if (!template || !workout) {
    return <WorkoutNotFound isDarkMode={isDarkMode} />;
  }

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <WorkoutHeader
        title={workout.name}
        onLeave={handleLeaveWorkout}
        onComplete={handleComplete}
        scrollY={scrollY}
        headerHeight={headerHeight}
        isDarkMode={isDarkMode}
      />

      <View className="flex-1">
        <WorkoutTimerSection
          isDarkMode={isDarkMode}
          scrollY={scrollY}
          headerHeight={headerHeight}
        />
        <ExerciseListHeader
          isDarkMode={isDarkMode}
          setExerciseSets={setExerciseSets}
          setLocalInputs={setLocalInputs}
        />
        <ExerciseList
          isDarkMode={isDarkMode}
          exerciseSets={exerciseSets}
          localInputs={localInputs}
          setLocalInputs={setLocalInputs}
          setExerciseSets={setExerciseSets}
          currentWorkout={currentWorkout}
          templateId={templateId}
          workoutId={workoutId}
          workout={{
            ...workout,
            exercises: activeExercises,
          }}
          template={template}
          handleAddSet={handleSetAdd}
          handleRemoveExercise={handleRemoveExercise}
          handleInputChange={handleSetInputChange}
          handleInputBlur={handleSetInputBlur}
          handleRemoveSet={handleSetRemove}
          onScroll={handleScroll}
        />
      </View>

      <QuitWorkoutDialog
        visible={showQuitDialog}
        onClose={() => setShowQuitDialog(false)}
        onConfirm={handleConfirmQuit}
        isDarkMode={isDarkMode}
      />
    </SafeAreaView>
  );
}
