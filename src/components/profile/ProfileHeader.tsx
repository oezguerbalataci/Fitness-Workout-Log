import { View } from "react-native";
import { Text } from "../../components/Text";
import { useThemeStore } from "../../store/themeStore";

export function ProfileHeader() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <View
      className={`px-6 pt-6 pb-8 border-b ${
        isDarkMode ? "border-gray-700" : "border-gray-100"
      }`}
    >
      <Text
        variant="bold"
        className={`text-2xl font-bold ${
          isDarkMode ? "text-white" : "text-gray-900"
        } mb-2`}
      >
        Profile
      </Text>
      <Text
        variant="regular"
        className={`text-base ${
          isDarkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        Track your progress and achievements
      </Text>
    </View>
  );
}
