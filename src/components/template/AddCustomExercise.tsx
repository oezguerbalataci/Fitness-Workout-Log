import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Text } from "../../components";
import { MaterialIcons } from "@expo/vector-icons";
import { useWorkoutStore, ExerciseDefinition } from "../../store/workoutStore";
import { useThemeStore } from "../../store/themeStore";
import { SafeAreaView } from "react-native-safe-area-context";

const bodyParts = [
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
  "Full Body",
  "Cardio",
  "Other",
];

interface AddCustomExerciseProps {
  isVisible: boolean;
  onClose: () => void;
  onAdd?: (exercise: ExerciseDefinition) => void;
  isDarkMode?: boolean;
}

export function AddCustomExercise({
  isVisible,
  onClose,
  onAdd,
  isDarkMode: propIsDarkMode,
}: AddCustomExerciseProps) {
  const isDarkMode =
    propIsDarkMode ?? useThemeStore((state) => state.isDarkMode);
  const addCustomExercise = useWorkoutStore((state) => state.addCustomExercise);

  const [name, setName] = useState("");
  const [selectedBodyPart, setSelectedBodyPart] = useState("");
  const [defaultSets, setDefaultSets] = useState("3");
  const [defaultReps, setDefaultReps] = useState("10");

  const handleSave = () => {
    if (!name.trim() || !selectedBodyPart || !defaultSets || !defaultReps)
      return;

    const exercise = {
      name: name.trim(),
      bodyPart: selectedBodyPart,
      defaultSets: parseInt(defaultSets),
      defaultReps: parseInt(defaultReps),
      isCustom: true,
    };

    const exerciseId = addCustomExercise(exercise);

    if (onAdd) {
      onAdd({ ...exercise, id: exerciseId });
    }

    // Reset form
    setName("");
    setSelectedBodyPart("");
    setDefaultSets("3");
    setDefaultReps("10");

    onClose();
  };

  const isValid = name.trim() && selectedBodyPart && defaultSets && defaultReps;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView
        className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
        edges={["top", "left", "right"]}
      >
        <View className="flex-row items-center justify-between px-4 py-2 border-b border-gray-800/10">
          <TouchableOpacity
            onPress={onClose}
            className="h-10 px-4 items-center justify-center rounded-full"
          >
            <Text
              variant="regular"
              className={isDarkMode ? "text-gray-300" : "text-gray-600"}
            >
              Cancel
            </Text>
          </TouchableOpacity>
          <Text
            variant="bold"
            className={`text-lg font-semibold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            New Exercise
          </Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={!isValid}
            className="h-10 px-4 items-center justify-center rounded-full"
          >
            <Text
              variant="medium"
              className={`font-semibold ${
                !isValid
                  ? isDarkMode
                    ? "text-gray-500"
                    : "text-gray-400"
                  : isDarkMode
                  ? "text-blue-400"
                  : "text-blue-600"
              }`}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-4 space-y-6">
            <View className="space-y-2">
              <Text
                variant="bold"
                className={`text-base font-medium ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Name
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g., Diamond Push-ups"
                placeholderTextColor={isDarkMode ? "#6b7280" : "#9ca3af"}
                className={`rounded-xl p-4 ${
                  isDarkMode
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              />
            </View>

            <View className="space-y-2">
              <Text
                variant="bold"
                className={`text-base font-medium ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Body Part
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {bodyParts.map((part) => (
                  <TouchableOpacity
                    key={part}
                    onPress={() => setSelectedBodyPart(part)}
                    className={`px-4 py-2.5 rounded-xl ${
                      selectedBodyPart === part
                        ? isDarkMode
                          ? "bg-blue-500"
                          : "bg-blue-600"
                        : isDarkMode
                        ? "bg-gray-800"
                        : "bg-gray-100"
                    }`}
                  >
                    <Text
                      variant={selectedBodyPart === part ? "medium" : "regular"}
                      className={`${
                        selectedBodyPart === part
                          ? "text-white font-medium"
                          : isDarkMode
                          ? "text-gray-400"
                          : "text-gray-600"
                      }`}
                    >
                      {part}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="space-y-2">
              <Text
                variant="bold"
                className={`text-base font-medium ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Default Values
              </Text>
              <View className="flex-row space-x-4">
                <View className="flex-1">
                  <Text
                    variant="regular"
                    className={`text-sm mb-2 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Sets
                  </Text>
                  <TextInput
                    value={defaultSets}
                    onChangeText={setDefaultSets}
                    placeholder="3"
                    placeholderTextColor={isDarkMode ? "#6b7280" : "#9ca3af"}
                    keyboardType="number-pad"
                    className={`rounded-xl p-4 ${
                      isDarkMode
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  />
                </View>

                <View className="flex-1">
                  <Text
                    variant="regular"
                    className={`text-sm mb-2 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Reps
                  </Text>
                  <TextInput
                    value={defaultReps}
                    onChangeText={setDefaultReps}
                    placeholder="10"
                    placeholderTextColor={isDarkMode ? "#6b7280" : "#9ca3af"}
                    keyboardType="number-pad"
                    className={`rounded-xl p-4 ${
                      isDarkMode
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <SafeAreaView edges={["bottom"]} className="px-4 py-4" />
      </SafeAreaView>
    </Modal>
  );
}
