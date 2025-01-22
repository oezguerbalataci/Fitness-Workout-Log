import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useTempWorkoutStore,
  type Exercise,
} from "../../../../src/store/workoutStore";
import { useState, useEffect, useCallback, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { useThemeStore } from "../../../../src/store/themeStore";

const CARD_HEIGHT = 80; // Approximate height of each card

type RouteParams = {
  exercises?: string;
};

const ExerciseCard = ({
  exercise,
  index,
  onRemove,
  onReorder,
  itemCount,
}: {
  exercise: Exercise;
  index: number;
  onRemove: (id: string) => void;
  onReorder: (from: number, to: number) => void;
  itemCount: number;
}) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const translateY = useSharedValue(0);
  const isActive = useSharedValue(false);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      isActive.value = true;
    },
    onActive: (event) => {
      translateY.value = event.translationY;
    },
    onEnd: () => {
      const destination = Math.round(translateY.value / CARD_HEIGHT);
      const newIndex = Math.max(
        0,
        Math.min(index + destination, itemCount - 1)
      );

      if (newIndex !== index) {
        runOnJS(onReorder)(index, newIndex);
      }

      translateY.value = withSpring(0);
      isActive.value = false;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      zIndex: isActive.value ? 1 : 0,
      shadowOpacity: withSpring(isActive.value ? 0.2 : 0),
      backgroundColor: withSpring(
        isActive.value
          ? isDarkMode
            ? "#1f2937"
            : "#ffffff"
          : isDarkMode
          ? "#111827"
          : "#f9fafb"
      ),
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={animatedStyle}>
        <View className={`p-4 rounded-lg mb-3`}>
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center flex-1">
              <MaterialIcons
                name="drag-handle"
                size={20}
                color={isDarkMode ? "#9ca3af" : "#6b7280"}
                style={{ marginRight: 8 }}
              />
              <View className="flex-1">
                <Text
                  className={`text-base font-medium ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {exercise.name}
                </Text>
                <View className="flex-row items-center mt-1 space-x-2">
                  <View className="flex-row items-center">
                    <MaterialIcons
                      name="repeat"
                      size={16}
                      color={isDarkMode ? "#9ca3af" : "#6b7280"}
                    />
                    <Text
                      className={`text-sm ml-1 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {exercise.sets} sets
                    </Text>
                  </View>
                  <Text
                    className={isDarkMode ? "text-gray-700" : "text-gray-300"}
                  >
                    •
                  </Text>
                  <View className="flex-row items-center">
                    <MaterialIcons
                      name="fitness-center"
                      size={16}
                      color={isDarkMode ? "#9ca3af" : "#6b7280"}
                    />
                    <Text
                      className={`text-sm ml-1 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {exercise.reps} reps
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => onRemove(exercise.id)}
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
          </View>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default function NewWorkoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<RouteParams>();
  const { workoutName, setWorkoutName, addTempWorkout, clearTempWorkouts } =
    useTempWorkoutStore((state) => ({
      workoutName: state.tempWorkoutName,
      setWorkoutName: state.setTempWorkoutName,
      addTempWorkout: state.addTempWorkout,
      clearTempWorkouts: state.clearTempWorkouts,
    }));
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  const [exercises, setExercises] = useState<Exercise[]>([]);

  // Load passed exercises from exercise selection
  useEffect(() => {
    if (params.exercises) {
      try {
        const parsedExercises = JSON.parse(params.exercises) as Exercise[];
        setExercises(parsedExercises);
      } catch (e) {
        console.error("Failed to parse exercises:", e);
      }
    }
  }, [params.exercises]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTempWorkouts();
    };
  }, [clearTempWorkouts]);

  const handleSave = useCallback(() => {
    if (!workoutName.trim() || exercises.length === 0) return;

    const newWorkout = {
      id: Date.now().toString(),
      name: workoutName.trim(),
      exercises: exercises.map((exercise) => ({
        ...exercise,
        id: `${exercise.id}-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
      })),
    };

    console.log("Creating new workout:", newWorkout);
    addTempWorkout(newWorkout);

    // Small delay to ensure state is updated before navigation
    setTimeout(() => {
      router.push("/template/new");
    }, 100);
  }, [workoutName, exercises, addTempWorkout, router]);

  const removeExercise = useCallback((exerciseId: string) => {
    setExercises((prev) => prev.filter((e) => e.id !== exerciseId));
  }, []);

  const reorderExercises = useCallback((fromIndex: number, toIndex: number) => {
    setExercises((prev) => {
      const newExercises = [...prev];
      const [movedItem] = newExercises.splice(fromIndex, 1);
      newExercises.splice(toIndex, 0, movedItem);
      return newExercises;
    });
  }, []);

  const navigateToExercises = useCallback(() => {
    router.push("/template/new/workout/new/exercises");
  }, [router]);

  const handleBack = () => {
    clearTempWorkouts();
    router.back();
  };

  const isValid = workoutName.trim() && exercises.length > 0;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
              New workout
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleSave}
            disabled={!isValid}
            className={`px-5 h-10 items-center justify-center rounded-lg ${
              !isValid
                ? isDarkMode
                  ? "bg-gray-800"
                  : "bg-gray-100"
                : "bg-black active:bg-gray-900"
            }`}
          >
            <Text
              className={`font-medium ${
                !isValid
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

        <ScrollView
          className="flex-1 px-4"
          scrollEnabled={exercises.length === 0}
        >
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
                value={workoutName}
                onChangeText={setWorkoutName}
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
                  onPress={navigateToExercises}
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
                <View>
                  {exercises.map((exercise, index) => (
                    <ExerciseCard
                      key={exercise.id}
                      exercise={exercise}
                      index={index}
                      onRemove={removeExercise}
                      onReorder={reorderExercises}
                      itemCount={exercises.length}
                    />
                  ))}
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
