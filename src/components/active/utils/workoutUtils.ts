import { useRouter } from "expo-router";
import { useWorkoutStore, LogExercise, ExerciseDefinition } from "../../../../src/store/workoutStore";
import { useTimerStore } from "../../../../src/store/timerStore";
import { Router } from "expo-router";

interface WorkoutSet {
  weight: number;
  reps: number;
  rpe?: number;
}

export const handleComplete = (
  exerciseSets: Record<string, WorkoutSet[]>,
  template: {
    id: string;
    name: string;
    workouts: {
      exercises: {
        id: string;
        name: string;
        bodyPart: string;
      }[];
    }[];
  },
  workout: {
    name: string;
    exercises: {
      id: string;
      name: string;
      bodyPart: string;
    }[];
  },
  router: Router
) => {
  const elapsedTime = useTimerStore.getState().elapsedTime;
  console.log("Completing workout with duration:", elapsedTime);
  
  // Stop and reset timer only after getting elapsed time
  useTimerStore.getState().stopTimer();
  useTimerStore.getState().resetTimer();

  // Force cleanup of any pending animation frames
  if (typeof window !== 'undefined') {
    const maxId = window.requestAnimationFrame(() => {});
    for (let i = 1; i < maxId; i++) {
      window.cancelAnimationFrame(i);
    }
  }

  // Update personal bests
  Object.entries(exerciseSets).forEach(([exerciseId, sets]) => {
    // Get the current workout state to find exercise info
    const currentWorkout = useWorkoutStore.getState().currentWorkout;
    const allExercises = useWorkoutStore.getState().customExercises;
    const defaultExercises = require("../../../../src/data/exercises").exercises as ExerciseDefinition[];

    // Find exercise info from workout or exercise libraries
    const baseId = exerciseId.split("-")[0];
    const exercise = 
      workout.exercises.find((e) => e.id === exerciseId) || // First try workout
      allExercises.find((e: ExerciseDefinition) => e.id === baseId) || // Then try custom exercises
      defaultExercises.find((e: ExerciseDefinition) => e.id === baseId) || // Then try default exercises
      {
        id: exerciseId,
        name: "Exercise",
        bodyPart: "",
      };

    // Check for personal best
    const bestSet = sets.reduce((best, current) => {
      if (!best) return current;
      if (current.weight > best.weight) return current;
      if (current.weight === best.weight && current.reps > best.reps)
        return current;
      return best;
    }, null as WorkoutSet | null);

    if (bestSet) {
      useWorkoutStore.getState().updatePersonalBest({
        id: `${exercise.id}-${Date.now()}`,
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        bodyPart: exercise.bodyPart,
        weight: bestSet.weight,
        reps: bestSet.reps,
        date: Date.now(),
      });
    }
  });

  // Complete the workout in the store
  useWorkoutStore.getState().completeCurrentWorkout();
  
  // Navigate to logs tab
  router.replace("/(tabs)/logs");
};

export const handleLeaveWorkout = (router: Router) => {
  // Stop and reset timer
  useTimerStore.getState().stopTimer();
  useTimerStore.getState().resetTimer();
  
  // Clear current workout without saving
  useWorkoutStore.getState().quitCurrentWorkout();
  
  // Force cleanup of any pending animation frames
  if (typeof window !== 'undefined') {
    const maxId = window.requestAnimationFrame(() => {});
    for (let i = 1; i < maxId; i++) {
      window.cancelAnimationFrame(i);
    }
  }
  
  // Navigate back to templates
  router.push("/(tabs)");
};

export const handleRemoveExercise = (
  exerciseId: string,
  setExerciseSets: React.Dispatch<React.SetStateAction<Record<string, WorkoutSet[]>>>,
  setLocalInputs: React.Dispatch<
    React.SetStateAction<
      Record<string, Record<number, { weight: string; reps: string; rpe: string }>>
    >
  >
) => {
  const store = useWorkoutStore.getState();
  
  // Remove from current workout
  store.removeExerciseFromCurrentWorkout(exerciseId);

  // Remove from local state
  setExerciseSets((prev) => {
    const newSets = { ...prev };
    delete newSets[exerciseId];
    return newSets;
  });

  setLocalInputs((prev) => {
    const newInputs = { ...prev };
    delete newInputs[exerciseId];
    return newInputs;
  });
}; 