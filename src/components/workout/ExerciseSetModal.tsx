import {
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { Text } from "../Text";
import { haptics } from "../../utils/haptics";
import { useState } from "react";

interface ExerciseSetModalProps {
  exerciseName: string;
  currentSet: number;
  totalSets: number;
  onFinishSet: (weight: number, rpe: number | null) => void;
  visible: boolean;
  onClose: () => void;
}

export function ExerciseSetModal({
  exerciseName,
  currentSet,
  totalSets,
  onFinishSet,
  visible,
  onClose,
}: ExerciseSetModalProps) {
  const [weight, setWeight] = useState("");
  const [rpe, setRpe] = useState("");

  const handleFinishSet = () => {
    haptics.medium();
    onFinishSet(parseFloat(weight) || 0, rpe ? parseFloat(rpe) : null);
    setWeight("");
    setRpe("");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center p-4"
        onPress={onClose}
      >
        <Pressable
          className="w-full max-w-md bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl"
          onPress={(e) => e.stopPropagation()}
        >
          <Text
            variant="bold"
            className="text-2xl text-center text-gray-900 dark:text-white mb-6"
          >
            {exerciseName}
          </Text>

          <Text
            variant="medium"
            className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8"
          >
            Set {currentSet} of {totalSets}
          </Text>

          <View className="space-y-6">
            <View className="flex-row justify-between gap-4">
              <View className="flex-1">
                <Text
                  variant="medium"
                  className="text-gray-700 dark:text-gray-300 mb-2"
                >
                  Weight (kg)
                </Text>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => {
                      const currentWeight = parseFloat(weight) || 0;
                      setWeight(Math.max(0, currentWeight - 2.5).toString());
                      haptics.light();
                    }}
                    className="bg-gray-200 dark:bg-gray-700 rounded-l-lg p-4"
                  >
                    <Text className="text-lg text-gray-900 dark:text-white">
                      -
                    </Text>
                  </TouchableOpacity>
                  <TextInput
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="decimal-pad"
                    className="flex-1 bg-gray-50 dark:bg-gray-800 p-4 text-lg text-gray-900 dark:text-white text-center"
                    placeholder="0"
                    placeholderTextColor="#9ca3af"
                  />
                  <TouchableOpacity
                    onPress={() => {
                      const currentWeight = parseFloat(weight) || 0;
                      setWeight((currentWeight + 2.5).toString());
                      haptics.light();
                    }}
                    className="bg-gray-200 dark:bg-gray-700 rounded-r-lg p-4"
                  >
                    <Text className="text-lg text-gray-900 dark:text-white">
                      +
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex-1">
                <Text
                  variant="medium"
                  className="text-gray-700 dark:text-gray-300 mb-2"
                >
                  RPE (optional)
                </Text>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => {
                      const currentRpe = parseFloat(rpe) || 0;
                      setRpe(Math.max(0, currentRpe - 0.5).toString());
                      haptics.light();
                    }}
                    className="bg-gray-200 dark:bg-gray-700 rounded-l-lg p-4"
                  >
                    <Text className="text-lg text-gray-900 dark:text-white">
                      -
                    </Text>
                  </TouchableOpacity>
                  <TextInput
                    value={rpe}
                    onChangeText={setRpe}
                    keyboardType="decimal-pad"
                    className="flex-1 bg-gray-50 dark:bg-gray-800 p-4 text-lg text-gray-900 dark:text-white text-center"
                    placeholder="0"
                    placeholderTextColor="#9ca3af"
                  />
                  <TouchableOpacity
                    onPress={() => {
                      const currentRpe = parseFloat(rpe) || 0;
                      setRpe(Math.min(10, currentRpe + 0.5).toString());
                      haptics.light();
                    }}
                    className="bg-gray-200 dark:bg-gray-700 rounded-r-lg p-4"
                  >
                    <Text className="text-lg text-gray-900 dark:text-white">
                      +
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleFinishSet}
            className="rounded-lg p-4 mt-8"
          >
            <Text variant="bold" className="text-black text-center text-lg">
              Finish Set
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
