import { View, TouchableOpacity } from "react-native";
import { Text } from "../../components";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useThemeStore } from "../../store/themeStore";

/**
 * Header component for the home screen
 */
export function HomeHeader() {
  const router = useRouter();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <View
      className={`px-6 pt-6 pb-8 border-b ${
        isDarkMode ? "border-gray-800" : "border-gray-100"
      }`}
    >
      <View className="flex-row justify-between items-center">
        <View>
          <Text
            variant="bold"
            className={`text-2xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            } mb-2`}
          >
            Workouts
          </Text>
          <Text
            variant="regular"
            className={`text-base ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Create and track your workouts
          </Text>
        </View>
      </View>
    </View>
  );
}
