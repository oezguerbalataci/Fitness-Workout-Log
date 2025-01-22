import { View } from "react-native";
import { useRouter, Stack } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useThemeStore } from "../../src/store/themeStore";

export default function CreateScreen() {
  const router = useRouter();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
      edges={["bottom", "top"]}
    >
      {/* Header Section */}
      <View
        className={`px-6 pt-6 pb-8 border-b ${
          isDarkMode ? "border-gray-800" : "border-gray-100"
        }`}
      >
        <Text
          className={`text-2xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          } mb-2`}
        >
          Create
        </Text>
        <Text
          className={`text-base ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Design your personalized workout routines
        </Text>
      </View>

      <View className="flex-1 px-6 items-center justify-center">
        <View
          className={`w-full ${
            isDarkMode ? "bg-gray-800" : "bg-gray-50"
          } rounded-2xl border ${
            isDarkMode ? "border-gray-700" : "border-gray-100"
          } p-8 items-center`}
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
            className={`text-lg font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            } mb-2`}
          >
            Create Your First Routine
          </Text>
          <Text
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            } text-center mb-6`}
          >
            Start by creating a routine to organize your workouts. Each routine
            can contain multiple workouts.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/template/new")}
            className={`${
              isDarkMode
                ? "bg-blue-600 active:bg-blue-700"
                : "bg-black active:bg-gray-900"
            } w-full py-4 rounded-xl`}
          >
            <Text className="text-white font-medium text-center">
              Create Routine
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
