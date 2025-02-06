import { useCallback } from "react";
import { useSharedValue } from "react-native-reanimated";
import { useWorkoutStore } from "../../../store/workoutStore";
import { ExerciseSet } from "../types";

interface UseExerciseReorderProps {
  activeExercises: ExerciseSet[];
  setIsEditMode: (value: boolean) => void;
}

export function useExerciseReorder({
  activeExercises,
  setIsEditMode,
}: UseExerciseReorderProps) {
  const positions = useSharedValue(
    Object.fromEntries(
      activeExercises.map((exercise, index) => [exercise.id, index])
    )
  );

  const handleReorderComplete = useCallback(() => {
    // Get the new order of exercises based on positions
    const newOrder = Object.entries(positions.value)
      .sort(([, a], [, b]) => a - b)
      .map(([id]) => id);

    // Update the workout store with the new order
    useWorkoutStore.getState().reorderExercises(newOrder);
    setIsEditMode(false);
  }, [positions, setIsEditMode]);

  return {
    positions,
    handleReorderComplete,
  };
} 