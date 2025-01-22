import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useTempWorkoutStore,
  type Exercise,
} from "../../../../src/store/workoutStore";
import { useThemeStore } from "../../../../src/store/themeStore";

type RouteParams = {
  id?: string | string[];
  exercises?: string | string[];
};

export default function EditWorkoutScreen() {
  const router = useRouter();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const params = useLocalSearchParams<RouteParams>();
  const [name, setName] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const { addTempWorkout, tempWorkouts, updateTempWorkout } =
    useTempWorkoutStore((state) => ({
      addTempWorkout: state.addTempWorkout,
      tempWorkouts: state.tempWorkouts || [],
      updateTempWorkout: state.updateTempWorkout,
    }));

  const workoutId = Array.isArray(params.id) ? params.id[0] : params.id;
  const isEditing = workoutId && workoutId !== "new";

  // Load existing workout data if editing
  useEffect(() => {
    if (isEditing) {
      const workout = tempWorkouts.find((w) => w.id === workoutId);
      if (workout) {
        setName(workout.name);
        setExercises(workout.exercises);
      }
    }
  }, [isEditing, workoutId, tempWorkouts]);

  // Load passed exercises from exercise selection
  useEffect(() => {
    if (params.exercises) {
      try {
        const exercisesStr = Array.isArray(params.exercises)
          ? params.exercises[0]
          : params.exercises;
        const parsedExercises = JSON.parse(exercisesStr) as Exercise[];
        setExercises((prevExercises) => {
          // Merge new exercises with existing ones, avoiding duplicates
          const existingIds = new Set(prevExercises.map((e) => e.id));
          const newExercises = parsedExercises.filter(
            (e) => !existingIds.has(e.id)
          );
          return [...prevExercises, ...newExercises];
        });
      } catch (e) {
        console.error("Failed to parse exercises:", e);
      }
    }
  }, [params.exercises]);

  const handleSave = () => {
    if (!name.trim()) return;

    if (isEditing) {
      updateTempWorkout({
        id: workoutId,
        name: name.trim(),
        exercises,
      });
    } else {
      addTempWorkout({
        id: Date.now().toString(),
        name: name.trim(),
        exercises,
      });
    }

    router.push("/template/new");
  };

  const removeExercise = (exerciseId: string) => {
    setExercises(exercises.filter((e) => e.id !== exerciseId));
  };

  const isDisabled = !name.trim() || exercises.length === 0;

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
    >
      <View className="flex-row items-center justify-between px-4 py-4">
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
            {isEditing ? "Edit workout" : "New workout"}
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

      <ScrollView className="flex-1 px-4">
        <View className="py-2 mb-6">
          <Text
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Add exercises to create your workout
          </Text>
        </View>

        <View className="space-y-8">
          <View className="space-y-2">
            <Text
              className={`text-base font-medium ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Workout Name
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
                Exercises
              </Text>
              <TouchableOpacity
                onPress={() =>
                  router.push(
                    `/template/new/workout/${workoutId || "new"}/exercises`
                  )
                }
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

            {exercises.length === 0 ? (
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
                  Add your first exercise
                </Text>
              </View>
            ) : (
              <View className="space-y-3">
                {exercises.map((exercise) => (
                  <View
                    key={exercise.id}
                    className={`${
                      isDarkMode ? "bg-gray-800" : "bg-gray-50"
                    } p-4 rounded-lg`}
                  >
                    <View className="flex-row justify-between items-center">
                      <Text
                        className={`text-base font-medium ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {exercise.name}
                      </Text>
                      <View className="flex-row items-center space-x-2">
                        <TouchableOpacity
                          onPress={() => removeExercise(exercise.id)}
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
                    <View className="flex-row items-center mt-1">
                      <View className="flex-row items-center">
                        <MaterialIcons
                          name="repeat"
                          size={16}
                          color={isDarkMode ? "#9ca3af" : "#6B7280"}
                        />
                        <Text
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          } ml-1`}
                        >
                          {exercise.sets} sets
                        </Text>
                      </View>
                      <Text
                        className={`text-sm ${
                          isDarkMode ? "text-gray-600" : "text-gray-300"
                        } mx-2`}
                      >
                        •
                      </Text>
                      <View className="flex-row items-center">
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
                          {exercise.reps} reps
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
