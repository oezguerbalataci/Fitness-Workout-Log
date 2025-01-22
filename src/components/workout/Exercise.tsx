import { View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "../../components";
import { ExerciseSetInput } from "./ExerciseSetInput";

interface ExerciseSet {
  weight: number;
  reps: number;
}

interface ExerciseProps {
  name: string;
  sets: ExerciseSet[];
  lastWeights?: number[];
  lastReps?: number[];
  defaultReps: number;
  onAddSet: () => void;
  onUpdateSet: (
    setIndex: number,
    field: "weight" | "reps",
    value: string
  ) => void;
}

export function Exercise({
  name,
  sets,
  lastWeights = [],
  lastReps = [],
  defaultReps,
  onAddSet,
  onUpdateSet,
}: ExerciseProps) {
  return (
    <View className="bg-white rounded-xl shadow-sm p-4 space-y-4">
      <View className="flex-row justify-between items-center">
        <Text variant="bold" className="text-xl font-bold text-gray-900">
          {name}
        </Text>
        <TouchableOpacity
          onPress={onAddSet}
          className="bg-blue-50 rounded-full p-2"
        >
          <MaterialIcons name="add" size={20} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      <View className="space-y-3">
        <View className="flex-row justify-between px-4">
          <Text
            variant="medium"
            className="text-sm font-medium text-gray-500 w-12"
          >
            Set
          </Text>
          <Text
            variant="medium"
            className="text-sm font-medium text-gray-500 w-20"
          >
            Weight (kg)
          </Text>
        </View>

        {sets.map((set, setIndex) => (
          <ExerciseSetInput
            key={setIndex}
            setIndex={setIndex}
            weight={set.weight}
            reps={set.reps}
            lastWeight={lastWeights[setIndex]}
            lastReps={lastReps[setIndex]}
            defaultReps={defaultReps}
            onUpdateSet={(field, value) => onUpdateSet(setIndex, field, value)}
          />
        ))}
      </View>
    </View>
  );
}
