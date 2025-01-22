import { View, TouchableOpacity } from "react-native";
import { Text } from "../../components/Text";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useThemeStore } from "../../store/themeStore";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightIcon?: {
    name: "save" | "add" | "edit";
    onPress: () => void;
    disabled?: boolean;
  };
  leftIcon?: {
    name: "close" | "arrow-back";
    onPress: () => void;
  };
}

export function Header({
  title,
  showBack = true,
  rightIcon,
  leftIcon,
}: HeaderProps) {
  const router = useRouter();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <View
      className={`flex-row items-center justify-between px-4 pt-2 pb-3 ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <View className="flex-row items-center space-x-3">
        {showBack ? (
          <TouchableOpacity
            onPress={() => router.back()}
            className={`w-10 h-10 items-center justify-center rounded-full ${
              isDarkMode
                ? "bg-gray-700 active:bg-gray-600"
                : "bg-gray-50 active:bg-gray-100"
            }`}
          >
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={isDarkMode ? "#9ca3af" : "#666"}
            />
          </TouchableOpacity>
        ) : leftIcon ? (
          <TouchableOpacity
            onPress={leftIcon.onPress}
            className={`w-10 h-10 items-center justify-center rounded-full ${
              isDarkMode
                ? "bg-gray-700 active:bg-gray-600"
                : "bg-gray-50 active:bg-gray-100"
            }`}
          >
            <MaterialIcons
              name={leftIcon.name}
              size={24}
              color={isDarkMode ? "#9ca3af" : "#666"}
            />
          </TouchableOpacity>
        ) : null}
        <Text
          variant="bold"
          className={`text-2xl font-semibold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </Text>
      </View>
      {rightIcon && (
        <TouchableOpacity
          onPress={rightIcon.onPress}
          disabled={rightIcon.disabled}
          className={`px-4 h-10 items-center justify-center rounded-full shadow-sm ${
            rightIcon.disabled
              ? isDarkMode
                ? "bg-gray-700"
                : "bg-gray-100"
              : isDarkMode
              ? "bg-blue-600 active:bg-blue-700"
              : "bg-black active:bg-gray-900"
          }`}
        >
          <MaterialIcons
            name={rightIcon.name}
            size={24}
            color={
              rightIcon.disabled ? (isDarkMode ? "#4b5563" : "#9ca3af") : "#fff"
            }
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
