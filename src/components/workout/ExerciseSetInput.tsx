import { View, TextInput } from "react-native";
import { Text } from "../../components/Text";

interface ExerciseSetInputProps {
  setIndex: number;
  weight: number;
  reps: number;
  lastWeight?: number;
  lastReps?: number;
  defaultReps: number;
  onUpdateSet: (field: "weight" | "reps", value: string) => void;
}

export function ExerciseSetInput({
  setIndex,
  weight,
  reps,
  lastWeight,
  lastReps,
  defaultReps,
  onUpdateSet,
}: ExerciseSetInputProps) {
  return (
    <View className="flex-row justify-between items-center bg-gray-50 rounded-lg p-3">
      <Text variant="medium" className="font-medium text-gray-700 w-12">
        {setIndex + 1}
      </Text>
      <TextInput
        value={weight > 0 ? weight.toString() : ""}
        onChangeText={(value) => onUpdateSet("weight", value)}
        keyboardType="decimal-pad"
        className="bg-white rounded-md px-3 py-2 w-20 text-gray-900 border border-gray-200"
        placeholder={lastWeight ? `${lastWeight}` : "0"}
        placeholderTextColor="#94a3b8"
        testID={`weight-input-${setIndex}`}
      />
      <TextInput
        value={reps > 0 ? reps.toString() : ""}
        onChangeText={(value) => onUpdateSet("reps", value)}
        keyboardType="number-pad"
        className="bg-white rounded-md px-3 py-2 w-20 text-gray-900 border border-gray-200"
        placeholder={lastReps ? `${lastReps}` : `${defaultReps}`}
        placeholderTextColor="#94a3b8"
        testID={`reps-input-${setIndex}`}
      />
    </View>
  );
}
