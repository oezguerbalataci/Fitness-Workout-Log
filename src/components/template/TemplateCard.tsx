import { View, TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Template } from "../../store/workoutStore";
import { useThemeStore } from "../../store/themeStore";

interface TemplateCardProps {
  template: Template;
  onPress: () => void;
  isLast: boolean;
  showAddIcon?: boolean;
}

/**
 * A card component that displays a template's basic information
 */
export function TemplateCard({
  template,
  onPress,
  isLast,
  showAddIcon = false,
}: TemplateCardProps) {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${
        isDarkMode ? "bg-gray-800" : "bg-gray-100"
      } rounded-lg p-2 ${
        isDarkMode ? "active:bg-gray-700" : "active:bg-gray-200"
      } ${!isLast ? "mb-1" : ""}`}
    >
      <View className="flex-row items-center justify-between">
        <Text
          variant="bold"
          className={`text-sm font-medium ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {template.name}
        </Text>
        <View className="flex-row items-center space-x-1">
          <Text
            variant="regular"
            className={`text-xs ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {template.workouts.length} workouts
          </Text>
          {showAddIcon && (
            <MaterialIcons
              name="add"
              size={16}
              color={isDarkMode ? "#ffffff" : "#000000"}
            />
          )}
        </View>
      </View>
      <View className="mt-1">
        {template.workouts.slice(0, 2).map((workout) => (
          <Text
            key={workout.id}
            variant="regular"
            className={`text-xs ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            • {workout.name}
            {workout.exercises.length > 0 && (
              <Text
                variant="regular"
                className={`${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
              >
                {" "}
                ({workout.exercises.length})
              </Text>
            )}
          </Text>
        ))}
        {template.workouts.length > 2 && (
          <Text
            variant="regular"
            className={`text-xs ${
              isDarkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            • {template.workouts.length - 2} more...
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
