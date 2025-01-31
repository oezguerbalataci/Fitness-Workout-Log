import { View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Text } from "../../components/Text";
import { AddExerciseModal } from "./AddExerciseModal";
import { WorkoutSet } from "../../store/workoutStore";
import { haptics } from "../../utils/haptics";

interface ExerciseListHeaderProps {
  isDarkMode: boolean;
  setExerciseSets: React.Dispatch<
    React.SetStateAction<Record<string, WorkoutSet[]>>
  >;
  setLocalInputs: React.Dispatch<
    React.SetStateAction<
      Record<
        string,
        Record<number, { weight: string; reps: string; rpe: string }>
      >
    >
  >;
}

export const ExerciseListHeader = ({
  isDarkMode,
  setExerciseSets,
  setLocalInputs,
}: ExerciseListHeaderProps) => {
  const [showAddExercise, setShowAddExercise] = useState(false);

  const handleAddExercise = () => {
    haptics.light();
    setShowAddExercise(true);
  };

  return (
    <>
      <View
        className={`flex-row justify-between items-center px-4 py-2 ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <Text
          variant="bold"
          className={`text-base font-semibold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Exercises
        </Text>
        <TouchableOpacity onPress={handleAddExercise}>
          <MaterialIcons
            name="add"
            size={24}
            color={isDarkMode ? "white" : "black"}
          />
        </TouchableOpacity>
      </View>
      <AddExerciseModal
        visible={showAddExercise}
        onClose={() => setShowAddExercise(false)}
        isDarkMode={isDarkMode}
        setExerciseSets={setExerciseSets}
        setLocalInputs={setLocalInputs}
      />
    </>
  );
};
