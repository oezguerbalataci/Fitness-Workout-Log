import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useTempWorkoutStore,
  type Exercise,
} from "../../../../../src/store/workoutStore";
import { useThemeStore } from "../../../../../src/store/themeStore";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
  useSharedValue,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";

const CARD_HEIGHT = 80; // Approximate height of each card

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
    onCancel: () => {
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
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: isActive.value ? 4 : 0,
    };
  });

  return (
    <PanGestureHandler
      onGestureEvent={gestureHandler}
      minDist={0}
      maxPointers={1}
      activateAfterLongPress={200}
    >
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

export default function EditWorkoutScreen() {
  const router = useRouter();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const params = useLocalSearchParams<{
    id: string;
    workoutId: string;
    exercises?: string;
  }>();
  const { id, workoutId, exercises: newExercises } = params;
  const [name, setName] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const { addTempWorkout, updateTempWorkout, tempWorkouts } =
    useTempWorkoutStore((state) => ({
      addTempWorkout: state.addTempWorkout,
      updateTempWorkout: state.updateTempWorkout,
      tempWorkouts: state.tempWorkouts || [],
    }));

  // Load existing workout data
  useEffect(() => {
    const workout = tempWorkouts.find((w) => w.id === workoutId);
    if (workout) {
      setName(workout.name);
      setExercises(workout.exercises);
    } else if (workoutId === "new") {
      // Initialize new workout
      setName("");
      setExercises([]);
    }
  }, [workoutId, tempWorkouts]);

  // Handle newly added exercises
  useEffect(() => {
    if (newExercises) {
      try {
        const parsedExercises = JSON.parse(newExercises) as Exercise[];
        setExercises((prev) => [...prev, ...parsedExercises]);
      } catch (error) {
        console.error("Failed to parse exercises:", error);
      }
    }
  }, [newExercises]);

  const handleSave = () => {
    console.log("handleSave called");
    console.log("name:", name);
    console.log("exercises:", exercises);
    console.log("workoutId:", workoutId);
    console.log("tempWorkouts before:", tempWorkouts);

    if (!name.trim()) {
      console.log("Empty name, returning");
      return;
    }

    const workout = {
      id: workoutId === "new" ? Date.now().toString() : workoutId,
      name: name.trim(),
      exercises,
    };
    console.log("workout to save:", workout);

    if (workoutId === "new") {
      console.log("Adding new workout");
      addTempWorkout(workout);
    } else {
      console.log("Updating existing workout");
      updateTempWorkout(workout);
    }

    console.log(
      "tempWorkouts after:",
      useTempWorkoutStore.getState().tempWorkouts
    );
    router.back();
  };

  const removeExercise = (exerciseId: string) => {
    setExercises(exercises.filter((e) => e.id !== exerciseId));
  };

  const reorderExercises = (fromIndex: number, toIndex: number) => {
    setExercises((prev) => {
      const newExercises = [...prev];
      const [movedItem] = newExercises.splice(fromIndex, 1);
      newExercises.splice(toIndex, 0, movedItem);
      return newExercises;
    });
  };

  const isDisabled = !name.trim() || exercises.length === 0;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
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
              Edit workout
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
                : isDarkMode
                ? "bg-blue-600 active:bg-blue-700"
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

        <ScrollView
          className={`flex-1 px-4 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
        >
          <View className="py-2 mb-6">
            <Text
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Edit your workout details
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
                placeholder="e.g., Push Day"
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
                      `/template/edit/${id}/workout/${workoutId}/exercises`
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
