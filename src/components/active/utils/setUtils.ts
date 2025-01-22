import { useWorkoutStore } from "../../../../src/store/workoutStore";

interface WorkoutSet {
  weight: number;
  reps: number;
  rpe?: number;
}

type SetInputs = Record<string, Record<number, { weight: string; reps: string; rpe: string }>>;

export const handleInputChange = (
  exerciseId: string,
  setIndex: number,
  field: "weight" | "reps" | "rpe",
  value: string,
  setLocalInputs: React.Dispatch<React.SetStateAction<SetInputs>>
) => {
  // Update local inputs immediately for responsive UI
  setLocalInputs((prev) => ({
    ...prev,
    [exerciseId]: {
      ...prev[exerciseId],
      [setIndex]: {
        ...prev[exerciseId]?.[setIndex],
        [field]: value,
      },
    },
  }));

  // If the value is valid, update the store immediately
  if (value.trim() !== "") {
    const numValue = parseFloat(value) || 0;
    useWorkoutStore.getState().updateCurrentSet(exerciseId, setIndex, field, numValue);
  }
};

export const handleInputBlur = (
  exerciseId: string,
  setIndex: number,
  field: "weight" | "reps" | "rpe",
  value: string,
  setExerciseSets: React.Dispatch<React.SetStateAction<Record<string, WorkoutSet[]>>>,
  currentWorkout: { exercises: Record<string, WorkoutSet[]> } | null,
  templateId: string,
  workoutId: string
) => {
  const numValue = parseFloat(value) || 0;

  // Always update both local state and store on blur
  setExerciseSets((prev) => {
    const newSets = [...(prev[exerciseId] || [])];
    if (!newSets[setIndex]) {
      newSets[setIndex] = { weight: 0, reps: 0, rpe: 0 };
    }
    newSets[setIndex] = {
      ...newSets[setIndex],
      [field]: numValue,
    };
    return {
      ...prev,
      [exerciseId]: newSets,
    };
  });

  // Update store
  useWorkoutStore.getState().updateCurrentSet(exerciseId, setIndex, field, numValue);
};

export const handleAddSet = (
  exerciseId: string,
  exerciseSets: Record<string, WorkoutSet[]>,
  workout: { exercises: { id: string; reps: number }[] },
  setExerciseSets: React.Dispatch<React.SetStateAction<Record<string, WorkoutSet[]>>>,
  setLocalInputs: React.Dispatch<React.SetStateAction<SetInputs>>,
  currentWorkout: { exercises: Record<string, WorkoutSet[]> } | null,
  templateId: string,
  workoutId: string
) => {
  const currentSets = exerciseSets[exerciseId] || [];
  const lastSet = currentSets[currentSets.length - 1];

  // Create new set with weight and reps from last set, but RPE at 0
  const newSet: WorkoutSet = {
    weight: lastSet?.weight || 0,
    reps: lastSet?.reps || workout.exercises.find((e) => e.id === exerciseId)?.reps || 0,
    rpe: 0,
  };

  // Update exerciseSets
  const updatedSets = [...currentSets, newSet];
  setExerciseSets((prev) => ({
    ...prev,
    [exerciseId]: updatedSets,
  }));

  // Update store
  useWorkoutStore.getState().addSetToExercise(exerciseId, newSet);

  // Update localInputs while preserving existing set values
  setLocalInputs((prev) => {
    const existingExerciseInputs = prev[exerciseId] || {};
    const lastLocalInput = prev[exerciseId]?.[currentSets.length - 1];
    
    return {
      ...prev,
      [exerciseId]: {
        ...existingExerciseInputs, // Preserve existing set inputs
        [currentSets.length]: {
          weight: lastLocalInput?.weight || lastSet?.weight?.toString() || "0",
          reps: lastLocalInput?.reps || lastSet?.reps?.toString() || "0",
          rpe: "", // Empty RPE for the new set
        },
      },
    };
  });
};

export const handleRemoveSet = (
  exerciseId: string,
  setIndex: number,
  setExerciseSets: React.Dispatch<React.SetStateAction<Record<string, WorkoutSet[]>>>,
  currentWorkout: { exercises: Record<string, WorkoutSet[]> } | null,
  templateId: string,
  workoutId: string,
  setLocalInputs?: React.Dispatch<
    React.SetStateAction<
      Record<string, Record<number, { weight: string; reps: string; rpe: string }>>
    >
  >
) => {
  // Update store first
  useWorkoutStore.getState().removeSetFromExercise(exerciseId, setIndex);

  // Update exerciseSets
  setExerciseSets((prev) => {
    const currentSets = [...(prev[exerciseId] || [])];
    currentSets.splice(setIndex, 1);
    return {
      ...prev,
      [exerciseId]: currentSets,
    };
  });

  // Update localInputs if provided
  if (setLocalInputs) {
    setLocalInputs((prev) => {
      const existingExerciseInputs = { ...prev[exerciseId] };
      
      // Remove the set at setIndex
      delete existingExerciseInputs[setIndex];
      
      // Shift the remaining sets down
      const updatedExerciseInputs: Record<number, { weight: string; reps: string; rpe: string }> = {};
      Object.entries(existingExerciseInputs).forEach(([key, value]) => {
        const keyNum = parseInt(key);
        if (keyNum > setIndex) {
          updatedExerciseInputs[keyNum - 1] = value;
        } else if (keyNum < setIndex) {
          updatedExerciseInputs[keyNum] = value;
        }
      });
      
      return {
        ...prev,
        [exerciseId]: updatedExerciseInputs,
      };
    });
  }
}; 