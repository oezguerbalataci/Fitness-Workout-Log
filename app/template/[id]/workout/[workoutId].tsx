import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import {
  useWorkoutStore,
  type Template,
  type Workout,
  type WorkoutSet,
} from "../../../../src/store/workoutStore";
import { useThemeStore } from "../../../../src/store/themeStore";
import { useTimerStore } from "../../../../src/store/timerStore";

export default function WorkoutScreen() {
  const router = useRouter();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { id, workoutId } = useLocalSearchParams<{
    id: string;
    workoutId: string;
  }>();

  const template = useWorkoutStore((state) =>
    state.templates.find((t: Template) => t.id === id)
  );
  const workout = template?.workouts.find((w: Workout) => w.id === workoutId);

  if (!template || !workout) {
    return null;
  }

  const handleStartWorkout = () => {
    if (!workout) return;

    // Start the workout
    useWorkoutStore.getState().startCurrentWorkout(id, workoutId);

    // Start the timer
    useTimerStore.getState().startTimer();

    // Navigate to active workout
    router.push({
      pathname: "../../../workout/active",
      params: { workoutId, templateId: id },
    });
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
    >
      <Stack.Screen options={{ headerShown: false }} />

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
            Start Workout
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="py-2 mb-6">
          <Text
            className={`text-xl font-medium ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {workout.name}
          </Text>
          <Text
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            } mt-1`}
          >
            Ready to start your workout?
          </Text>
        </View>

        <View className="space-y-3">
          {workout.exercises.map((exercise) => (
            <View
              key={exercise.id}
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-gray-50"
              } p-4 rounded-lg`}
            >
              <Text
                className={`text-base font-medium ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {exercise.name}
              </Text>
              <View className="flex-row items-center mt-1">
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
                    {exercise.sets} sets × {exercise.reps} reps
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <SafeAreaView
        edges={["bottom"]}
        className={isDarkMode ? "bg-gray-900" : "bg-white"}
      >
        <View className="px-4 py-4">
          <TouchableOpacity
            onPress={handleStartWorkout}
            className="bg-black rounded-lg py-4 active:bg-gray-900"
          >
            <Text className="text-white font-medium text-center text-base">
              Start Workout
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}
