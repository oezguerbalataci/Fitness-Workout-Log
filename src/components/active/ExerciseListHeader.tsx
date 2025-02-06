import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface ExerciseListHeaderProps {
  isDarkMode: boolean;
  isEditMode: boolean;
  onEditModeToggle: (isEdit: boolean) => void;
  onReorderComplete: () => void;
}

export function ExerciseListHeader({
  isDarkMode,
  isEditMode,
  onEditModeToggle,
  onReorderComplete,
}: ExerciseListHeaderProps) {
  const router = useRouter();

  return (
    <View className="px-4 py-4">
      <View className="flex-row items-center justify-between">
        <Text
          className={`text-lg font-medium ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Exercises
        </Text>
        <View className="flex-row gap-2">
          {!isEditMode && (
            <TouchableOpacity
              className={`flex-row items-center gap-2 py-2 px-3 rounded-full ${
                isDarkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
              onPress={() => onEditModeToggle(true)}
            >
              <MaterialIcons
                name="reorder"
                size={20}
                color={isDarkMode ? "#fff" : "#000"}
              />
              <Text
                className={`font-medium ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Reorder
              </Text>
            </TouchableOpacity>
          )}
          {isEditMode ? (
            <TouchableOpacity
              className={`flex-row items-center gap-2 py-2 px-3 rounded-full ${
                isDarkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
              onPress={onReorderComplete}
            >
              <MaterialIcons
                name="check"
                size={20}
                color={isDarkMode ? "#fff" : "#000"}
              />
              <Text
                className={`font-medium ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Done
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className={`flex-row items-center gap-2 py-2 px-3 rounded-full ${
                isDarkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
              onPress={() => router.push("/workout/exercises")}
            >
              <MaterialIcons
                name="add"
                size={20}
                color={isDarkMode ? "#fff" : "#000"}
              />
              <Text
                className={`font-medium ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Add Exercise
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
