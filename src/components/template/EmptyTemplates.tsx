import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useThemeStore } from "../../store/themeStore";

/**
 * Component shown when the user has no templates
 */
export function EmptyTemplates() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <View
      className={`py-12 items-center ${
        isDarkMode ? "bg-gray-800" : "bg-gray-100"
      } rounded-2xl`}
    >
      <View
        className={`${
          isDarkMode ? "bg-gray-700" : "bg-white"
        } w-16 h-16 rounded-full items-center justify-center mb-6 shadow-sm`}
      >
        <MaterialIcons
          name="fitness-center"
          size={32}
          color={isDarkMode ? "#ffffff" : "#000000"}
        />
      </View>
      <Text
        variant="bold"
        className={`text-lg font-bold ${
          isDarkMode ? "text-white" : "text-gray-900"
        } mb-2`}
      >
        No routines yet
      </Text>
      <Text
        variant="regular"
        className={`text-sm ${
          isDarkMode ? "text-gray-400" : "text-gray-500"
        } text-center px-8`}
      >
        Create your first workout routine to get started
      </Text>
    </View>
  );
}
