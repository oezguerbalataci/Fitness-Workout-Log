import { View, ScrollView, TouchableOpacity, Modal, Text } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useWorkoutStore } from "../../src/store/workoutStore";
import { useThemeStore } from "../../src/store/themeStore";
import { useState } from "react";

export default function TemplateScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Get template data from store
  const template = useWorkoutStore((state) =>
    state.templates.find((t) => t.id === id)
  );

  // Handle edit template
  const handleEditTemplate = () => {
    router.push(`/template/edit/${template?.id}`);
  };

  const handleBack = () => {
    router.back();
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (template) {
      useWorkoutStore.getState().deleteTemplate(template.id);
      router.replace("/(tabs)");
    }
  };

  // Return early if template not found
  if (!template) {
    return (
      <SafeAreaView
        className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
      >
        <View className="flex-row items-center px-4 py-4">
          <TouchableOpacity
            onPress={handleBack}
            className="w-10 h-10 items-center justify-center rounded-lg active:bg-gray-50"
          >
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={isDarkMode ? "#fff" : "#000"}
            />
          </TouchableOpacity>
          <Text
            className={`text-xl font-medium ${
              isDarkMode ? "text-white" : "text-gray-900"
            } ml-3`}
          >
            Routine not found
          </Text>
        </View>
        <View className="flex-1 justify-center items-center p-4">
          <Text
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            } text-center`}
          >
            The routine you're looking for doesn't exist
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-row items-center justify-between px-4 py-4">
        <View className="flex-row items-center space-x-3">
          <TouchableOpacity
            onPress={handleBack}
            className={`w-10 h-10 items-center justify-center rounded-lg ${
              isDarkMode ? "active:bg-gray-800" : "active:bg-gray-50"
            }`}
          >
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={isDarkMode ? "#fff" : "#000"}
            />
          </TouchableOpacity>
          <Text
            className={`text-xl font-medium ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {template.name}
          </Text>
        </View>
        <View className="flex-row items-center space-x-2">
          <TouchableOpacity
            onPress={handleDelete}
            className={`w-10 h-10 items-center justify-center rounded-lg ${
              isDarkMode ? "bg-red-900/30" : "bg-red-50"
            }`}
          >
            <MaterialIcons
              name="delete"
              size={24}
              color={isDarkMode ? "#f87171" : "#ef4444"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleEditTemplate}
            className={`w-10 h-10 items-center justify-center rounded-lg ${
              isDarkMode ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            <MaterialIcons
              name="edit"
              size={24}
              color={isDarkMode ? "#fff" : "#000"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="py-2 mb-6">
          <Text
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Select a workout to begin tracking your progress
          </Text>
        </View>

        {template.workouts.length === 0 ? (
          <View className="py-12 items-center">
            <MaterialIcons
              name="fitness-center"
              size={32}
              color={isDarkMode ? "#4b5563" : "#94a3b8"}
              style={{ marginBottom: 8 }}
            />
            <Text
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-400"
              }`}
            >
              Add your first workout
            </Text>
            <TouchableOpacity
              onPress={handleEditTemplate}
              className="mt-6 bg-black px-5 h-10 items-center justify-center rounded-lg active:bg-gray-900"
            >
              <Text className="text-white font-medium">Add Workout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="space-y-6">
            {template.workouts.map((workout) => (
              <TouchableOpacity
                key={workout.id}
                onPress={() =>
                  router.push({
                    pathname: "/template/[id]/workout/[workoutId]",
                    params: { id: template.id, workoutId: workout.id },
                  })
                }
                className={`p-4 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-800 active:bg-gray-700"
                    : "bg-gray-50 active:bg-gray-100"
                } mb-2`}
              >
                <Text
                  className={`text-base font-medium ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {workout.name}
                </Text>
                <View className="flex-row items-center mt-1">
                  <MaterialIcons
                    name="fitness-center"
                    size={16}
                    color={isDarkMode ? "#9ca3af" : "#6B7280"}
                  />
                  <Text
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    } ml-1`}
                  >
                    {workout.exercises.length} exercises
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Delete Confirmation Dialog */}
      <Modal
        visible={showDeleteDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteDialog(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View
            className={`mx-4 p-6 rounded-2xl ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <View className="items-center mb-4">
              <MaterialIcons
                name="warning"
                size={48}
                color={isDarkMode ? "#f87171" : "#ef4444"}
              />
            </View>

            <Text
              className={`text-xl text-center mb-2 font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Delete Routine?
            </Text>

            <Text
              className={`text-base text-center mb-6 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Are you sure you want to delete this routine? This action cannot
              be undone.
            </Text>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowDeleteDialog(false)}
                className={`flex-1 py-3 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <Text
                  className={`text-center font-medium ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmDelete}
                className="flex-1 py-3 rounded-lg bg-red-500"
              >
                <Text className="text-center text-white font-medium">
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
