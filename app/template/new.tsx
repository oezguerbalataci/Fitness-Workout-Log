import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, TextInput, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useWorkoutStore,
  useTempWorkoutStore,
  type Workout,
} from "../../src/store/workoutStore";
import { useThemeStore } from "../../src/store/themeStore";

export default function CreateTemplateScreen() {
  const router = useRouter();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { tempWorkouts, clearTempWorkouts } = useTempWorkoutStore((state) => ({
    tempWorkouts: state.tempWorkouts,
    clearTempWorkouts: state.clearTempWorkouts,
  }));
  const [name, setName] = useState("");

  useEffect(() => {
    console.log("Current temp workouts:", tempWorkouts);
  }, [tempWorkouts]);

  const handleBack = () => {
    clearTempWorkouts();
    router.back();
  };

  const handleSave = () => {
    if (!name.trim() || tempWorkouts.length === 0) {
      Alert.alert(
        "Invalid Template",
        "Please provide a template name and add at least one workout."
      );
      return;
    }

    // Check if template name already exists
    const templates = useWorkoutStore.getState().templates;
    const nameExists = templates.some(
      (t) => t.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (nameExists) {
      Alert.alert(
        "Name Already Exists",
        "A routine with this name already exists. Please choose a different name."
      );
      return;
    }

    console.log("Saving template with workouts:", tempWorkouts);

    // Create new template
    const success = useWorkoutStore.getState().addTemplate({
      name: name.trim(),
      workouts: tempWorkouts,
    });

    if (success) {
      clearTempWorkouts();
      router.push("/(tabs)");
    }
  };

  const isDisabled = !name.trim() || tempWorkouts.length === 0;

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
            New routine
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleSave}
          disabled={isDisabled}
          className={`px-5 h-10 items-center justify-center rounded-lg ${
            isDisabled
              ? isDarkMode
                ? "bg-gray-800"
                : "bg-gray-100"
              : "bg-black active:bg-gray-900"
          }`}
        >
          <Text
            className={`font-medium ${
              isDisabled
                ? isDarkMode
                  ? "text-gray-600"
                  : "text-gray-400"
                : "text-white"
            }`}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 px-4">
        <View className="py-2 mb-6">
          <Text
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Add workouts to create your routine
          </Text>
        </View>

        <View className="space-y-8">
          <View className="space-y-2">
            <Text
              className={`text-base font-medium ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Routine Name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g., Upper Body"
              placeholderTextColor={isDarkMode ? "#4b5563" : "#94a3b8"}
              className={`rounded-lg p-4 ${
                isDarkMode
                  ? "bg-gray-800 text-white"
                  : "bg-gray-50 text-gray-900"
              }`}
            />
          </View>

          <View className="space-y-4">
            <View className="flex-row justify-between items-center">
              <Text
                className={`text-base font-medium ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Workouts
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/template/new/workout/new")}
                className={`w-10 h-10 items-center justify-center rounded-lg ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-50"
                }`}
              >
                <MaterialIcons
                  name="add"
                  size={24}
                  color={isDarkMode ? "#fff" : "#000"}
                />
              </TouchableOpacity>
            </View>

            {tempWorkouts.length === 0 ? (
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
              </View>
            ) : (
              <View className="space-y-3">
                {tempWorkouts.map((workout) => (
                  <TouchableOpacity
                    key={workout.id}
                    onPress={() =>
                      router.push(`/template/new/workout/${workout.id}`)
                    }
                    className={`p-4 rounded-lg ${
                      isDarkMode ? "bg-gray-800" : "bg-gray-50"
                    } space-y-2`}
                  >
                    <View className="flex-row justify-between items-center">
                      <Text
                        className={`text-base font-medium ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {workout.name}
                      </Text>
                      <View className="flex-row items-center space-x-2">
                        <TouchableOpacity
                          onPress={(e) => {
                            e.stopPropagation();
                            useTempWorkoutStore
                              .getState()
                              .removeTempWorkout(workout.id);
                          }}
                          className={`w-8 h-8 items-center justify-center rounded-lg ${
                            isDarkMode ? "bg-red-900/30" : "bg-red-50"
                          }`}
                        >
                          <MaterialIcons
                            name="delete"
                            size={18}
                            color={isDarkMode ? "#f87171" : "#ef4444"}
                          />
                        </TouchableOpacity>
                        <View
                          className={`w-8 h-8 items-center justify-center rounded-lg ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-100"
                          }`}
                        >
                          <MaterialIcons
                            name="edit"
                            size={18}
                            color={isDarkMode ? "#9ca3af" : "#666"}
                          />
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
