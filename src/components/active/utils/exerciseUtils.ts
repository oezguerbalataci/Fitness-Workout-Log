import { Exercise, ExerciseDefinition } from "../../../../src/store/workoutStore";
import { exercises as defaultExercises } from "../../../../src/data/exercises";
import { useWorkoutStore } from "../../../../src/store/workoutStore";

export const findExerciseFromTemplate = (
  exerciseId: string,
  workoutExercises: Exercise[],
  templateExercises: Exercise[]
): Exercise => {
  // First try to find in workout exercises
  const workoutExercise = workoutExercises.find((e) => e.id === exerciseId);
  if (workoutExercise) return workoutExercise;

  // Get the base ID (without timestamp)
  const baseId = exerciseId.split("-")[0];

  // Try to find in custom exercises
  const customExercises = useWorkoutStore.getState().customExercises;
  const customExercise = customExercises.find((e) => e.id === baseId);
  if (customExercise) {
    return {
      id: exerciseId,
      name: customExercise.name,
      bodyPart: customExercise.bodyPart,
      sets: customExercise.defaultSets,
      reps: customExercise.defaultReps,
    };
  }

  // Try to find in default exercises
  const defaultExercise = defaultExercises.find((e) => e.id === baseId);
  if (defaultExercise) {
    return {
      id: exerciseId,
      name: defaultExercise.name,
      bodyPart: defaultExercise.bodyPart,
      sets: defaultExercise.defaultSets,
      reps: defaultExercise.defaultReps,
    };
  }

  // Try to find in template exercises as a last resort
  const exerciseFromTemplate = templateExercises.find(
    (e) => e.id.split("-")[0] === baseId
  );
  if (exerciseFromTemplate) {
    return {
      id: exerciseId,
      name: exerciseFromTemplate.name,
      bodyPart: exerciseFromTemplate.bodyPart,
      sets: exerciseFromTemplate.sets,
      reps: exerciseFromTemplate.reps,
    };
  }

  // If not found anywhere, return a default exercise
  return {
    id: exerciseId,
    name: "Exercise",
    bodyPart: "",
    sets: 0,
    reps: 0,
  };
};

export const createNewExercise = (
  selectedExercise: ExerciseDefinition,
  numSets: number
): Exercise => {
  return {
    id: `${selectedExercise.id}-${Date.now()}`,
    name: selectedExercise.name,
    sets: numSets,
    reps: selectedExercise.defaultReps,
    bodyPart: selectedExercise.bodyPart,
  };
}; 