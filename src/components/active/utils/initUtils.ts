import { useTimerStore } from "../../../../src/store/timerStore";
import { useWorkoutStore } from "../../../../src/store/workoutStore";

interface WorkoutSet {
  weight: number;
  reps: number;
  rpe?: number;
}

export const initializeExerciseSets = (
  currentWorkout: { exercises: Record<string, WorkoutSet[]> } | null,
  workout: { exercises: { id: string; sets: number; reps: number }[] } | undefined
): Record<string, WorkoutSet[]> => {
  if (currentWorkout) {
    return currentWorkout.exercises;
  } else if (workout) {
    const initialSets: Record<string, WorkoutSet[]> = {};
    workout.exercises.forEach((exercise) => {
      initialSets[exercise.id] = Array(exercise.sets)
        .fill(null)
        .map(() => ({ weight: 0, reps: exercise.reps, rpe: 0 }));
    });
    return initialSets;
  }
  return {};
};

export const initializeLocalInputs = (
  exerciseSets: Record<string, WorkoutSet[]>
): Record<string, Record<number, { weight: string; reps: string; rpe: string }>> => {
  const initialInputs: Record<
    string,
    Record<number, { weight: string; reps: string; rpe: string }>
  > = {};
  
  Object.entries(exerciseSets).forEach(([exerciseId, sets]) => {
    initialInputs[exerciseId] = {};
    sets.forEach((set, index) => {
      initialInputs[exerciseId][index] = {
        weight: set.weight ? set.weight.toString() : "",
        reps: set.reps ? set.reps.toString() : "",
        rpe: set.rpe ? set.rpe.toString() : "",
      };
    });
  });
  
  return initialInputs;
};

export const initializeTimer = async () => {
  const existingTimer = await useTimerStore.getState().checkAndRestoreTimer();
  const currentWorkout = useWorkoutStore.getState().currentWorkout;
  
  // If there's a current workout but no timer running, start it
  if (currentWorkout && !existingTimer) {
    useTimerStore.getState().startTimer();
  }
}; 