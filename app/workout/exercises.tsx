import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useMemo } from "react";
import { exercises as exerciseData } from "../../src/data/exercises";
import {
  type Exercise,
  ExerciseDefinition,
  useWorkoutStore,
} from "../../src/store/workoutStore";
import { useThemeStore } from "../../src/store/themeStore";
import { AddCustomExercise } from "../../src/components/template/AddCustomExercise";

export default function ActiveWorkoutExerciseSelectionScreen() {
  const router = useRouter();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddExercise, setShowAddExercise] = useState(false);
  const customExercises = useWorkoutStore((state) => state.customExercises);
  const addExerciseToCurrentWorkout = useWorkoutStore(
    (state) => state.addExerciseToCurrentWorkout
  );

  // Combine default and custom exercises
  const allExercises = useMemo(
    () => [...exerciseData, ...customExercises],
    [customExercises]
  );

  // Filter exercises based on search query
  const filteredExercises = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return allExercises;

    return allExercises.filter(
      (exercise) =>
        exercise.name.toLowerCase().includes(query) ||
        exercise.bodyPart.toLowerCase().includes(query)
    );
  }, [searchQuery, allExercises]);

  const handleSelectExercise = (exercise: ExerciseDefinition) => {
    // Add the exercise to the active workout
    addExerciseToCurrentWorkout({
      id: exercise.id,
      name: exercise.name,
      sets: exercise.defaultSets || 3,
      reps: exercise.defaultReps || 10,
      bodyPart: exercise.bodyPart,
    });

    // Navigate back
    router.back();
  };

  const clearSearch = () => setSearchQuery("");

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
      edges={["top", "right", "bottom", "left"]}
    >
      <View
        className={`flex-row items-center justify-between px-4 py-4 ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <View className="flex-row items-center space-x-3">
          <TouchableOpacity
            onPress={() => router.back()}
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
            Add exercise
          </Text>
        </View>
      </View>

      <ScrollView
        className={`flex-1 px-4 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
      >
        <View className="py-2 mb-6">
          <Text
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Select an exercise to add to your workout
          </Text>
        </View>

        {/* Search and Add Custom Exercise */}
        <View className="space-y-4 mb-6">
          {/* Search Bar */}
          <View className="relative">
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search exercises..."
              placeholderTextColor={isDarkMode ? "#4b5563" : "#94a3b8"}
              className={`rounded-lg pl-12 pr-4 py-4 ${
                isDarkMode
                  ? "bg-gray-800 text-white"
                  : "bg-gray-50 text-gray-900"
              }`}
            />
            <View className="absolute left-4 top-4">
              <MaterialIcons
                name="search"
                size={24}
                color={isDarkMode ? "#4b5563" : "#94a3b8"}
              />
            </View>
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={clearSearch}
                className="absolute right-4 top-4"
              >
                <MaterialIcons
                  name="close"
                  size={24}
                  color={isDarkMode ? "#4b5563" : "#94a3b8"}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Add Custom Exercise Button */}
          <TouchableOpacity
            onPress={() => setShowAddExercise(true)}
            className={`flex-row items-center justify-center py-4 rounded-lg ${
              isDarkMode ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            <MaterialIcons
              name="add-circle-outline"
              size={24}
              color={isDarkMode ? "#fff" : "#000"}
              style={{ marginRight: 8 }}
            />
            <Text
              className={`font-medium ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Create Custom Exercise
            </Text>
          </TouchableOpacity>
        </View>

        <View className="space-y-3">
          {filteredExercises.map((exercise) => (
            <TouchableOpacity
              key={exercise.name}
              onPress={() => handleSelectExercise(exercise)}
              className={`p-4 rounded-lg ${
                isDarkMode ? "bg-gray-800" : "bg-gray-50"
              }`}
            >
              <Text
                className={`text-base font-medium ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {exercise.name}
                {exercise.isCustom && (
                  <Text
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {" "}
                    (Custom)
                  </Text>
                )}
              </Text>
              <Text
                className={`text-sm mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {exercise.bodyPart}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <AddCustomExercise
        isVisible={showAddExercise}
        onClose={() => setShowAddExercise(false)}
        onAdd={(exercise: ExerciseDefinition) => {
          handleSelectExercise(exercise);
          setShowAddExercise(false);
        }}
        isDarkMode={isDarkMode}
      />
    </SafeAreaView>
  );
}
