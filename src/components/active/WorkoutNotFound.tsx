import { View } from "react-native";
import { Text } from "../../components/Text";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

interface WorkoutNotFoundProps {
  isDarkMode: boolean;
}

export const WorkoutNotFound = ({ isDarkMode }: WorkoutNotFoundProps) => {
  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <View className="flex-1 items-center justify-center">
        <MaterialIcons
          name="error-outline"
          size={48}
          color={isDarkMode ? "#4b5563" : "#94A3B8"}
        />
        <Text
          variant="medium"
          className={`text-gray-500 mt-4 ${isDarkMode ? "text-gray-400" : ""}`}
        >
          Workout not found
        </Text>
      </View>
    </SafeAreaView>
  );
};
