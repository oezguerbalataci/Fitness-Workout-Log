import React, { useCallback, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  Layout,
  SlideOutRight,
  BounceIn,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";

interface SetData {
  weight: number;
  reps: number;
  rpe?: number;
}

interface WorkoutSetProps {
  isDarkMode: boolean;
  setIndex: number;
  exerciseId: string;
  set: SetData;
  localInputs: Record<
    string,
    Record<number, { weight: string; reps: string; rpe: string }>
  >;
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
}

// Memoized input component to prevent unnecessary re-renders
const SetInput = React.memo(
  ({
    value,
    placeholder,
    onChange,
    onBlur,
    isDarkMode,
    keyboardType,
    label,
    validate,
  }: {
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    isDarkMode: boolean;
    keyboardType: "decimal-pad" | "number-pad";
    label: string;
    validate?: (value: string) => boolean;
  }) => (
    <View className="flex-row items-center">
      <View className="w-16">
        <TextInput
          value={value}
          onChangeText={(text) => {
            if (!validate || validate(text)) {
              onChange(text);
            }
          }}
          onBlur={onBlur}
          placeholder={placeholder}
          keyboardType={keyboardType}
          className={`text-center py-2 px-1 rounded-lg text-sm font-medium ${
            isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
          }`}
          placeholderTextColor={isDarkMode ? "#4b5563" : "#94a3b8"}
        />
        <Text
          className={`text-[10px] text-center mt-0.5 ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {label}
        </Text>
      </View>
    </View>
  )
);

export const WorkoutSet = React.memo(
  ({
    isDarkMode,
    setIndex,
    exerciseId,
    set,
    localInputs,
    handleInputChange,
    handleInputBlur,
    handleRemoveSet,
  }: WorkoutSetProps) => {
    const exerciseInputs = localInputs[exerciseId] || {};

    // Memoize input handlers
    const handleWeightChange = useCallback(
      (value: string) =>
        handleInputChange(exerciseId, setIndex, "weight", value),
      [exerciseId, setIndex, handleInputChange]
    );

    const handleRepsChange = useCallback(
      (value: string) => handleInputChange(exerciseId, setIndex, "reps", value),
      [exerciseId, setIndex, handleInputChange]
    );

    const handleRPEChange = useCallback(
      (value: string) => handleInputChange(exerciseId, setIndex, "rpe", value),
      [exerciseId, setIndex, handleInputChange]
    );

    const handleWeightBlur = useCallback(
      () =>
        handleInputBlur(
          exerciseId,
          setIndex,
          "weight",
          exerciseInputs[setIndex]?.weight ?? set.weight?.toString() ?? ""
        ),
      [exerciseId, setIndex, handleInputBlur, exerciseInputs, set.weight]
    );

    const handleRepsBlur = useCallback(
      () =>
        handleInputBlur(
          exerciseId,
          setIndex,
          "reps",
          exerciseInputs[setIndex]?.reps ?? set.reps?.toString() ?? ""
        ),
      [exerciseId, setIndex, handleInputBlur, exerciseInputs, set.reps]
    );

    const handleRPEBlur = useCallback(
      () =>
        handleInputBlur(
          exerciseId,
          setIndex,
          "rpe",
          exerciseInputs[setIndex]?.rpe ?? set.rpe?.toString() ?? ""
        ),
      [exerciseId, setIndex, handleInputBlur, exerciseInputs, set.rpe]
    );

    const handleSetRemove = useCallback(
      () => handleRemoveSet(exerciseId, setIndex),
      [exerciseId, setIndex, handleRemoveSet]
    );

    // Input validation functions
    const validateWeight = useCallback(
      (value: string) => /^\d*\.?\d*$/.test(value),
      []
    );
    const validateReps = useCallback(
      (value: string) => /^\d*$/.test(value),
      []
    );
    const validateRPE = useCallback(
      (value: string) => /^\d*$/.test(value) && parseInt(value) <= 10,
      []
    );

    return (
      <Animated.View
        key={`${exerciseId}-${setIndex}`}
        className="flex-row items-center"
        layout={Layout.springify()}
        entering={BounceIn.duration(400)}
        exiting={SlideOutRight.duration(200)}
      >
        <View
          className={`flex-1 flex-row items-center justify-between p-2.5 rounded-lg ${
            isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
          }`}
        >
          <View className="flex-row items-center">
            <Text
              className={`font-medium min-w-[60px] p-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Set {setIndex + 1}
            </Text>
            <View className="flex-1 flex-row items-center justify-end space-x-6">
              <SetInput
                value={
                  exerciseInputs[setIndex]?.weight ??
                  set.weight?.toString() ??
                  ""
                }
                placeholder="0"
                onChange={handleWeightChange}
                onBlur={handleWeightBlur}
                isDarkMode={isDarkMode}
                keyboardType="decimal-pad"
                label="kg"
                validate={validateWeight}
              />

              <SetInput
                value={
                  exerciseInputs[setIndex]?.reps ?? set.reps?.toString() ?? ""
                }
                placeholder="0"
                onChange={handleRepsChange}
                onBlur={handleRepsBlur}
                isDarkMode={isDarkMode}
                keyboardType="number-pad"
                label="reps"
                validate={validateReps}
              />

              <SetInput
                value={
                  exerciseInputs[setIndex]?.rpe ?? set.rpe?.toString() ?? ""
                }
                placeholder="0"
                onChange={handleRPEChange}
                onBlur={handleRPEBlur}
                isDarkMode={isDarkMode}
                keyboardType="number-pad"
                label="RPE"
                validate={validateRPE}
              />
            </View>

            <TouchableOpacity onPress={handleSetRemove} className="pl-4">
              <MaterialIcons
                name="remove-circle-outline"
                size={20}
                color={isDarkMode ? "#9CA3AF" : "#4B5563"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  }
);
