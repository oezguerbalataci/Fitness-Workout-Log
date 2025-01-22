import { View, TouchableOpacity, ScrollView } from "react-native";
import { Text } from "../../components/Text";
import { useRouter } from "expo-router";
import { useWorkoutStore } from "../../store/workoutStore";
import { MaterialIcons } from "@expo/vector-icons";
import { useThemeStore } from "../../store/themeStore";

export function TemplateList() {
  const router = useRouter();
  const templates = useWorkoutStore((state) => state.templates);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  if (templates.length === 0) {
    return (
      <View
        className={`mx-6 py-12 items-center ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl border ${
          isDarkMode ? "border-gray-700" : "border-gray-100"
        }`}
      >
        <View
          className={`${
            isDarkMode ? "bg-gray-700" : "bg-gray-50"
          } w-16 h-16 rounded-full items-center justify-center mb-4`}
        >
          <MaterialIcons
            name="fitness-center"
            size={32}
            color={isDarkMode ? "#9ca3af" : "#94A3B8"}
          />
        </View>
        <Text
          variant="medium"
          className={`text-base font-medium ${
            isDarkMode ? "text-white" : "text-gray-900"
          } mb-2`}
        >
          No templates yet
        </Text>
        <Text
          variant="regular"
          className={`text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          } text-center px-6`}
        >
          Create your first workout template
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/template/new")}
          className="mt-6 flex-row items-center px-4 py-2 rounded-lg bg-blue-500 active:bg-blue-600"
        >
          <MaterialIcons name="add" size={20} color="white" />
          <Text
            variant="medium"
            className="ml-2 text-sm font-medium text-white"
          >
            Create Template
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1">
      <View className="p-4 space-y-4">
        {templates.map((template) => (
          <TouchableOpacity
            key={template.id}
            onPress={() => router.push(`../../template/${template.id}`)}
            className={`p-4 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-xl border ${
              isDarkMode ? "border-gray-700" : "border-gray-100"
            } active:opacity-70`}
          >
            <View className="flex-row justify-between items-center">
              <Text
                variant="bold"
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {template.name}
              </Text>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={isDarkMode ? "#9ca3af" : "#94A3B8"}
              />
            </View>

            <View>
              <Text
                variant="regular"
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {template.workouts.length} workout
                {template.workouts.length !== 1 ? "s" : ""}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={() => router.push("/template/new")}
          className={`p-4 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } rounded-xl border ${
            isDarkMode ? "border-gray-700" : "border-gray-100"
          } items-center active:opacity-70`}
        >
          <MaterialIcons
            name="add"
            size={24}
            color={isDarkMode ? "#9ca3af" : "#94A3B8"}
          />
          <Text
            variant="medium"
            className={`mt-1 text-sm font-medium ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Create Template
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
