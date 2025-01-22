import {
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { ExerciseCard } from "./ExerciseCard";
import { findExerciseFromTemplate } from "./utils/exerciseUtils";
import {
  Exercise,
  useWorkoutStore,
  Template,
  Workout,
} from "../../../src/store/workoutStore";

interface SetData {
  weight: number;
  reps: number;
  rpe?: number;
}

interface ExerciseListProps {
  isDarkMode: boolean;
  exerciseSets: Record<string, SetData[]>;
  localInputs: Record<
    string,
    Record<number, { weight: string; reps: string; rpe: string }>
  >;
  setLocalInputs: React.Dispatch<
    React.SetStateAction<
      Record<
        string,
        Record<number, { weight: string; reps: string; rpe: string }>
      >
    >
  >;
  setExerciseSets: React.Dispatch<
    React.SetStateAction<Record<string, SetData[]>>
  >;
  currentWorkout: {
    exercises: Record<string, SetData[]>;
    exerciseData: Record<
      string,
      {
        name: string;
        bodyPart: string;
        sets: number;
        reps: number;
      }
    >;
  } | null;
  templateId: string;
  workoutId: string;
  workout: Workout;
  template: Template;
  handleAddSet: (exerciseId: string) => void;
  handleRemoveExercise: (exerciseId: string) => void;
  handleInputChange: (
    exerciseId: string,
    setIndex: number,
    field: "weight" | "reps" | "rpe",
    value: string
  ) => void;
  handleInputBlur: (
    exerciseId: string,
    setIndex: number,
    field: "weight" | "reps" | "rpe",
    value: string
  ) => void;
  handleRemoveSet: (exerciseId: string, setIndex: number) => void;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export const ExerciseList = ({
  isDarkMode,
  exerciseSets,
  localInputs,
  setLocalInputs,
  setExerciseSets,
  currentWorkout,
  templateId,
  workoutId,
  workout,
  template,
  handleAddSet,
  handleRemoveExercise,
  handleInputChange,
  handleInputBlur,
  handleRemoveSet,
  onScroll,
}: ExerciseListProps) => {
  return (
    <ScrollView
      className={`flex-1 px-4 pt-4 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
      showsVerticalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={16}
    >
      {workout.exercises.map((exercise, index) => {
        const exerciseData = findExerciseFromTemplate(
          exercise.id,
          workout.exercises,
          template.workouts.flatMap((w) => w.exercises)
        );

        return (
          <ExerciseCard
            key={exercise.id}
            exerciseId={exercise.id}
            index={index}
            isDarkMode={isDarkMode}
            exercise={exerciseData}
            sets={exerciseSets[exercise.id] || []}
            localInputs={localInputs}
            setLocalInputs={setLocalInputs}
            setExerciseSets={setExerciseSets}
            currentWorkout={currentWorkout}
            templateId={templateId}
            workoutId={workoutId}
            handleAddSet={handleAddSet}
            handleRemoveExercise={handleRemoveExercise}
            handleInputChange={handleInputChange}
            handleInputBlur={handleInputBlur}
            handleRemoveSet={handleRemoveSet}
          />
        );
      })}
    </ScrollView>
  );
};
