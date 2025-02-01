import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { haptics } from "../../../../src/utils/haptics";
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
    return (
      <SafeAreaView
        className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
      >
        <View className="px-4 py-4">
          <TouchableOpacity
            onPress={() => router.back()}
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
            Workout Not Found
          </Text>
          <Text
            className={`text-base mt-2 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            } text-center`}
          >
            The workout you're looking for doesn't exist
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleStartWorkout = () => {
    if (!workout) return;
    haptics.success();
    useWorkoutStore.getState().startCurrentWorkout(id, workoutId);
    useTimerStore.getState().startTimer();
    router.push({
      pathname: "../../../workout/active",
      params: { workoutId, templateId: id },
    });
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className={`px-4 py-4 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity
              onPress={() => router.back()}
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
              className={`text-2xl font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {workout.name}
            </Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-4 pt-2"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6">
          <Text
            className={`text-base ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {workout.exercises.length}{" "}
            {workout.exercises.length === 1 ? "exercise" : "exercises"} · ~
            {workout.exercises.length * 10} min
          </Text>
        </View>

        <View className="gap-4">
          {workout.exercises.map((exercise, index) => (
            <View
              key={exercise.id}
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

              {/* Exercise Number */}
              <View
                className={`absolute top-5 right-5 w-8 h-8 rounded-full items-center justify-center ${
                  isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {index + 1}
                </Text>
              </View>

              {/* Content */}
              <View>
                <Text
                  className={`text-lg font-medium mb-3 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {exercise.name}
                </Text>

                <View className="flex-row items-center gap-4">
                  <View className="flex-row items-center">
                    <MaterialIcons
                      name="repeat"
                      size={18}
                      color={isDarkMode ? "#9CA3AF" : "#6B7280"}
                    />
                    <Text
                      className={`text-base ml-2 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {exercise.sets} sets
                    </Text>
                  </View>

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
                      {exercise.reps} reps
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <SafeAreaView
        edges={["bottom"]}
        className={isDarkMode ? "bg-gray-900" : "bg-white"}
      >
        <View className="px-4 py-4">
          <TouchableOpacity
            onPress={handleStartWorkout}
            className={`h-14 items-center justify-center rounded-2xl ${
              isDarkMode ? "bg-white" : "bg-black"
            }`}
          >
            <Text
              className={`text-base font-medium ${
                isDarkMode ? "text-black" : "text-white"
              }`}
            >
              Start Workout
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
});
