import React, { useCallback } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "../../components/Text";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, { SlideInRight, Layout } from "react-native-reanimated";
import { WorkoutSet } from "./WorkoutSet";
import { Exercise } from "../../../src/store/workoutStore";

interface SetData {
  weight: number;
  reps: number;
  rpe?: number;
}

interface ExerciseCardProps {
  exerciseId: string;
  index: number;
  isDarkMode: boolean;
  exercise: Exercise | undefined;
  sets: SetData[];
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
  handleAddSet: (exerciseId: string) => void;
  handleRemoveExercise: (exerciseId: string) => void;
  handleInputChange: (
    exerciseId: string,
    setIndex: number,
    field: "weight" | "reps" | "rpe",
    value: string,
    setLocalInputs: React.Dispatch<
      React.SetStateAction<
        Record<
          string,
          Record<number, { weight: string; reps: string; rpe: string }>
        >
      >
    >
  ) => void;
  handleInputBlur: (
    exerciseId: string,
    setIndex: number,
    field: "weight" | "reps" | "rpe",
    value: string,
    setExerciseSets: React.Dispatch<
      React.SetStateAction<Record<string, SetData[]>>
    >,
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
    } | null,
    templateId: string,
    workoutId: string
  ) => void;
  handleRemoveSet: (exerciseId: string, setIndex: number) => void;
}

export const ExerciseCard = React.memo(
  ({
    exerciseId,
    index,
    isDarkMode,
    exercise,
    sets,
    localInputs,
    setLocalInputs,
    setExerciseSets,
    currentWorkout,
    templateId,
    workoutId,
    handleAddSet,
    handleRemoveExercise,
    handleInputChange: parentHandleInputChange,
    handleInputBlur: parentHandleInputBlur,
    handleRemoveSet,
  }: ExerciseCardProps) => {
    const exerciseData = currentWorkout?.exerciseData?.[exerciseId] || {
      name: exercise?.name || "Exercise",
      bodyPart: exercise?.bodyPart || "",
      sets: exercise?.sets || 0,
      reps: exercise?.reps || 0,
    };

    const handleInputChangeWrapper = useCallback(
      (
        exerciseId: string,
        setIndex: number,
        field: "weight" | "reps" | "rpe",
        value: string
      ) => {
        parentHandleInputChange(
          exerciseId,
          setIndex,
          field,
          value,
          setLocalInputs
        );
      },
      [parentHandleInputChange, setLocalInputs]
    );

    const handleInputBlurWrapper = useCallback(
      (
        exerciseId: string,
        setIndex: number,
        field: "weight" | "reps" | "rpe",
        value: string
      ) => {
        parentHandleInputBlur(
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
      [
        parentHandleInputBlur,
        setExerciseSets,
        currentWorkout,
        templateId,
        workoutId,
      ]
    );

    return (
      <Animated.View
        entering={SlideInRight.delay(index * 100)}
        layout={Layout}
        className={`mb-3 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <View className="px-4 py-3">
          <View className="flex-row items-center content-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <View>
                <Text
                  variant="bold"
                  className={`text-base font-medium ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {exerciseData.name}
                </Text>
                <Text
                  variant="regular"
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {exerciseData.bodyPart}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleRemoveExercise(exerciseId)}
                className={`p-2 rounded-lg flex-row items-center gap-1 ${
                  isDarkMode ? "bg-red-500/20" : "bg-red-50"
                }`}
              >
                <MaterialIcons
                  name="delete-outline"
                  size={16}
                  color={isDarkMode ? "#F87171" : "#DC2626"}
                />
                <Text
                  variant="medium"
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-red-400" : "text-red-600"
                  }`}
                >
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => handleAddSet(exerciseId)}
              className={`p-2 rounded-md flex-row items-center ${
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <MaterialIcons
                name="add"
                size={16}
                color={isDarkMode ? "#fff" : "#000"}
              />
              <Text
                variant="medium"
                className={`text-sm font-medium ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Add Set
              </Text>
            </TouchableOpacity>
          </View>

          <View className="space-y-2">
            {sets.map((set, setIndex) => (
              <WorkoutSet
                key={`${exerciseId}-${setIndex}`}
                setIndex={setIndex}
                isDarkMode={isDarkMode}
                exerciseId={exerciseId}
                localInputs={localInputs}
                set={set}
                handleInputChange={handleInputChangeWrapper}
                handleInputBlur={handleInputBlurWrapper}
                handleRemoveSet={handleRemoveSet}
              />
            ))}
          </View>
        </View>
      </Animated.View>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.exerciseId === nextProps.exerciseId &&
      prevProps.isDarkMode === nextProps.isDarkMode &&
      prevProps.sets === nextProps.sets &&
      prevProps.localInputs === nextProps.localInputs
    );
  }
);
