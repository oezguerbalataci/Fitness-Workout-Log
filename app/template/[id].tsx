import {
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Text,
  StyleSheet,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useWorkoutStore } from "../../src/store/workoutStore";
import { useThemeStore } from "../../src/store/themeStore";
import { useState } from "react";
import { BlurView } from "expo-blur";

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
        <View className="px-4 py-4">
          <TouchableOpacity
            onPress={handleBack}
            className={`h-10 w-10 items-center justify-center rounded-full ${
              isDarkMode ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={isDarkMode ? "#fff" : "#000"}
            />
          </TouchableOpacity>
        </View>
        <View className="flex-1 justify-center items-center p-4">
          <MaterialIcons
            name="error-outline"
            size={48}
            color={isDarkMode ? "#6B7280" : "#9CA3AF"}
          />
          <Text
            className={`text-xl font-semibold mt-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Routine Not Found
          </Text>
          <Text
            className={`text-base mt-2 ${
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
      className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className={`px-4 py-4 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 gap-4 mr-3">
            <TouchableOpacity
              onPress={handleBack}
              className={`h-10 w-10 items-center justify-center rounded-full ${
                isDarkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <MaterialIcons
                name="arrow-back"
                size={24}
                color={isDarkMode ? "#fff" : "#000"}
              />
            </TouchableOpacity>
            <Text
              numberOfLines={2}
              className={`text-2xl font-semibold flex-shrink ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {template.name}
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={handleDelete}
              className={`h-10 w-10 items-center justify-center rounded-full ${
                isDarkMode ? "bg-red-900/30" : "bg-red-50"
              }`}
            >
              <MaterialIcons
                name="delete"
                size={22}
                color={isDarkMode ? "#f87171" : "#ef4444"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleEditTemplate}
              className={`h-10 w-10 items-center justify-center rounded-full ${
                isDarkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <MaterialIcons
                name="edit"
                size={22}
                color={isDarkMode ? "#fff" : "#000"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-4 pt-2"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          className={`text-base mb-6 ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Select a workout to begin tracking your progress
        </Text>

        {template.workouts.length === 0 ? (
          <View className="py-12 items-center">
            <View
              className={`rounded-full p-4 mb-4 ${
                isDarkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <MaterialIcons
                name="fitness-center"
                size={32}
                color={isDarkMode ? "#6B7280" : "#94A3B8"}
              />
            </View>
            <Text
              className={`text-lg font-medium mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              No Workouts Yet
            </Text>
            <Text
              className={`text-base ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              } text-center mb-6`}
            >
              Add your first workout to get started
            </Text>
            <TouchableOpacity
              onPress={handleEditTemplate}
              className={`px-6 h-12 items-center justify-center rounded-full ${
                isDarkMode ? "bg-white" : "bg-black"
              }`}
            >
              <Text
                className={`text-base font-medium ${
                  isDarkMode ? "text-black" : "text-white"
                }`}
              >
                Add Workout
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="gap-4">
            {template.workouts.map((workout) => (
              <TouchableOpacity
                key={workout.id}
                onPress={() =>
                  router.push({
                    pathname: "/template/[id]/workout/[workoutId]",
                    params: { id: template.id, workoutId: workout.id },
                  })
                }
                className={`p-5 rounded-2xl overflow-hidden ${
                  isDarkMode ? "bg-gray-800/80" : "bg-white"
                } shadow-sm`}
                style={isDarkMode ? {} : styles.lightShadow}
              >
                {/* Decorative Circle */}
                <View
                  className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10"
                  style={{
                    backgroundColor: isDarkMode ? "#ffffff" : "#000000",
                  }}
                />

                {/* Content Container */}
                <View className="flex-row justify-between items-start">
                  <View className="flex-1 mr-4">
                    <Text
                      className={`text-lg font-medium mb-2 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {workout.name}
                    </Text>

                    {/* Stats Row */}
                    <View className="flex-row items-center gap-4">
                      <View className="flex-row items-center">
                        <MaterialIcons
                          name="fitness-center"
                          size={18}
                          color={isDarkMode ? "#9CA3AF" : "#6B7280"}
                        />
                        <Text
                          className={`text-base ml-2 ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {workout.exercises.length}{" "}
                          {workout.exercises.length === 1
                            ? "exercise"
                            : "exercises"}
                        </Text>
                      </View>

                      <View className="flex-row items-center">
                        <MaterialIcons
                          name="timer"
                          size={18}
                          color={isDarkMode ? "#9CA3AF" : "#6B7280"}
                        />
                        <Text
                          className={`text-base ml-2 ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          ~{workout.exercises.length * 10} min
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Right Icon Container */}
                  <View
                    className={`p-3 rounded-xl ${
                      isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
                    }`}
                  >
                    <MaterialIcons
                      name="chevron-right"
                      size={24}
                      color={isDarkMode ? "#9CA3AF" : "#6B7280"}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Delete Modal */}
      <Modal
        visible={showDeleteDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteDialog(false)}
      >
        <BlurView
          intensity={isDarkMode ? 40 : 60}
          tint={isDarkMode ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        >
          <View className="flex-1 justify-center items-center px-4">
            <View
              className={`w-full max-w-sm p-6 rounded-3xl ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } shadow-xl`}
              style={isDarkMode ? {} : styles.modalShadow}
            >
              <View className="items-center mb-4">
                <View
                  className={`rounded-full p-4 ${
                    isDarkMode ? "bg-red-900/30" : "bg-red-50"
                  }`}
                >
                  <MaterialIcons
                    name="warning"
                    size={32}
                    color={isDarkMode ? "#f87171" : "#ef4444"}
                  />
                </View>
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
                This action cannot be undone. All workouts in this routine will
                be permanently deleted.
              </Text>

              <View className="gap-3">
                <TouchableOpacity
                  onPress={handleConfirmDelete}
                  className="py-4 rounded-2xl bg-red-500"
                >
                  <Text className="text-center text-white font-medium text-base">
                    Delete Routine
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowDeleteDialog(false)}
                  className={`py-4 rounded-2xl ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`text-center font-medium text-base ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </BlurView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  lightShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modalShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
});
