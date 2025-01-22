import { View, Switch } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "../../components/Text";
import { useThemeStore } from "../../store/themeStore";

export function ThemeToggle() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <View className="px-6 mt-6">
      <View
        className={`rounded-2xl border ${
          isDarkMode
            ? "border-gray-800 bg-gray-800"
            : "border-gray-100 bg-white"
        }`}
      >
        <View className="p-4 flex-row justify-between items-center">
          <View className="flex-row items-center">
            <MaterialIcons
              name={isDarkMode ? "dark-mode" : "light-mode"}
              size={24}
              color={isDarkMode ? "white" : "#374151"}
            />
            <Text
              variant="medium"
              className={`ml-3 text-base font-medium ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Dark Mode
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: "#d1d5db", true: "#3b82f6" }}
            thumbColor="white"
          />
        </View>
      </View>
    </View>
  );
}
