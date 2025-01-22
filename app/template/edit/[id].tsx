import { View, TouchableOpacity, Text, TextInput, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useWorkoutStore,
  useTempWorkoutStore,
  type Template,
  type Workout,
} from "../../../src/store/workoutStore";
import { useThemeStore } from "../../../src/store/themeStore";
import { useEffect } from "react";

export default function EditTemplateScreen() {
  const router = useRouter();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { id } = useLocalSearchParams<{ id: string }>();
  const template = useWorkoutStore((state) =>
    state.templates.find((t) => t.id === id)
  );

  const {
    tempTemplateName,
    setTempTemplateName,
    tempWorkouts,
    setTempWorkouts,
    clearTempWorkouts,
  } = useTempWorkoutStore((state) => ({
    tempTemplateName: state.tempTemplateName,
    setTempTemplateName: state.setTempTemplateName,
    tempWorkouts: state.tempWorkouts || [],
    setTempWorkouts: state.setTempWorkouts,
    clearTempWorkouts: state.clearTempWorkouts,
  }));

  // Initialize temp state with template data
  useEffect(() => {
    if (template) {
      setTempTemplateName(template.name);
      setTempWorkouts(template.workouts);
    }
  }, [template, setTempTemplateName, setTempWorkouts]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTempWorkouts();
  }, [clearTempWorkouts]);

  const handleSave = () => {
    if (!tempTemplateName?.trim()) return;

    // Check if template with same name already exists
    const nameExists = useWorkoutStore
      .getState()
      .templates.some(
        (t) =>
          t.id !== id &&
          t.name.toLowerCase() === tempTemplateName.trim().toLowerCase()
      );

    if (nameExists) {
      Alert.alert(
        "Name Already Exists",
        "You already have a routine with this name. Please choose a different name."
      );
      return;
    }

    // Update template
    useWorkoutStore.getState().updateTemplate({
      id,
      name: tempTemplateName.trim(),
      workouts: tempWorkouts,
      createdAt: template?.createdAt || Date.now(),
      updatedAt: Date.now(),
    });

    clearTempWorkouts();
    router.back();
  };

  const handleBack = () => {
    clearTempWorkouts();
    router.back();
  };

  const isDisabled = !tempTemplateName?.trim() || !tempWorkouts?.length;

  if (!template) {
    return null;
  }

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
    >
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
            Edit routine
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
            Edit your routine details
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
              value={tempTemplateName}
              onChangeText={setTempTemplateName}
              placeholder="e.g., Full Body Workout"
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
                onPress={() => router.push(`/template/edit/${id}/workout/new`)}
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
                      router.push(`/template/edit/${id}/workout/${workout.id}`)
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
                            setTempWorkouts(
                              tempWorkouts.filter((w) => w.id !== workout.id)
                            );
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
