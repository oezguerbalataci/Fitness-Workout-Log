import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import {
  useWorkoutStore,
  LogExercise,
  Exercise,
} from "../../src/store/workoutStore";
import { useThemeStore } from "../../src/store/themeStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Header } from "../../src/components/ui/Header";
import { WorkoutTimer } from "../../src/components/workout/WorkoutTimer";
import { useTimerStore } from "../../src/store/timerStore";
import { WorkoutNotFound } from "../../src/components/active/WorkoutNotFound";
import Animated, {
  FadeOut,
  Layout,
  SlideOutRight,
  ZoomOut,
  FadeIn,
  runOnJS,
  SlideInRight,
  BounceIn,
  Easing,
  withSpring,
  withTiming,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { WorkoutSet } from "../../src/components/active/WorkoutSet";
import { ExerciseCard } from "../../src/components/active/ExerciseCard";
import { WorkoutHeader } from "../../src/components/active/WorkoutHeader";
import { findExerciseFromTemplate } from "../../src/components/active/utils/exerciseUtils";
import {
  handleInputChange,
  handleInputBlur,
  handleAddSet,
  handleRemoveSet,
} from "../../src/components/active/utils/setUtils";
import {
  handleComplete as handleWorkoutComplete,
  handleLeaveWorkout as handleWorkoutLeave,
  handleRemoveExercise as handleWorkoutRemoveExercise,
} from "../../src/components/active/utils/workoutUtils";
import {
  initializeExerciseSets,
  initializeLocalInputs,
  initializeTimer,
} from "../../src/components/active/utils/initUtils";
import { ExerciseListHeader } from "../../src/components/active/ExerciseListHeader";
import { WorkoutTimerSection } from "../../src/components/active/WorkoutTimerSection";
import { ExerciseList } from "../../src/components/active/ExerciseList";
import { exercises as defaultExercises } from "../../src/data/exercises";
import { QuitWorkoutDialog } from "../../src/components/active/QuitWorkoutDialog";
import { AppState } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { FinishWorkoutDialog } from "../../src/components/active/FinishWorkoutDialog";

interface SetData {
  weight: number;
  reps: number;
  rpe?: number;
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
  floatingTimer: {
    position: "absolute",
    right: 16,
    zIndex: 50,
  },
  floatingFinish: {
    position: "absolute",
    right: 16,
    bottom: 60,
    zIndex: 50,
  },
  floatingShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  draggableCard: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});

interface DraggableExerciseCardProps {
  exercise: {
    id: string;
    name: string;
  };
  positions: Animated.SharedValue<Record<string, number>>;
  scrollY: Animated.SharedValue<number>;
  isDarkMode: boolean;
  index: number;
  count: number;
}

function DraggableExerciseCard({
  exercise,
  positions,
  scrollY,
  isDarkMode,
  index,
  count,
}: DraggableExerciseCardProps) {
  const translateY = useSharedValue(0);
  const isActive = useSharedValue(false);
  const currentPosition = useSharedValue(index);
  const CARD_HEIGHT = 56;

  const gesture = Gesture.Pan()
    .onStart(() => {
      isActive.value = true;
      currentPosition.value = positions.value[exercise.id];
    })
    .onUpdate((event) => {
      translateY.value = event.translationY;
      const newPosition = Math.round(
        (currentPosition.value * CARD_HEIGHT + event.translationY) / CARD_HEIGHT
      );

      // Clamp the position between 0 and count-1
      const clampedPosition = Math.max(0, Math.min(count - 1, newPosition));

      if (clampedPosition !== positions.value[exercise.id]) {
        const oldPosition = positions.value[exercise.id];
        const newPositions = { ...positions.value };

        Object.keys(positions.value).forEach((key) => {
          const pos = positions.value[key];
          if (key === exercise.id) {
            newPositions[key] = clampedPosition;
          } else if (
            oldPosition < clampedPosition &&
            pos > oldPosition &&
            pos <= clampedPosition
          ) {
            newPositions[key] = pos - 1;
          } else if (
            oldPosition > clampedPosition &&
            pos < oldPosition &&
            pos >= clampedPosition
          ) {
            newPositions[key] = pos + 1;
          }
        });

        positions.value = newPositions;
      }
    })
    .onEnd(() => {
      const finalPosition = positions.value[exercise.id];
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 200,
      });
      isActive.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => {
    const position = positions.value[exercise.id];
    const top = position * CARD_HEIGHT;

    return {
      position: "absolute",
      left: 0,
      right: 0,
      top,
      zIndex: isActive.value ? 1000 : 1,
      transform: [
        { translateY: translateY.value },
        {
          scale: withSpring(isActive.value ? 1.03 : 1, {
            mass: 0.5,
            damping: 15,
            stiffness: 200,
          }),
        },
      ],
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: isActive.value
        ? withSpring(
            isDarkMode ? "rgba(31, 41, 55, 0.9)" : "rgba(255, 255, 255, 0.9)",
            {
              mass: 0.5,
              damping: 15,
              stiffness: 200,
            }
          )
        : withSpring(
            isDarkMode ? "rgba(31, 41, 55, 0.8)" : "rgba(255, 255, 255, 1)",
            {
              mass: 0.5,
              damping: 15,
              stiffness: 200,
            }
          ),
      transform: [
        {
          scale: withSpring(isActive.value ? 1.02 : 1, {
            mass: 0.5,
            damping: 15,
            stiffness: 200,
          }),
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[animatedStyle]} className="px-4 mb-1">
        <Animated.View
          className={`py-2.5 px-4 rounded-lg overflow-hidden ${
            isDarkMode ? "bg-gray-800/80" : "bg-white"
          }`}
          style={[isDarkMode ? {} : styles.draggableCard, containerStyle]}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text
                className={`text-sm font-medium ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {exercise.name}
              </Text>
            </View>
            <MaterialIcons
              name="drag-handle"
              size={20}
              color={isDarkMode ? "#9CA3AF" : "#6B7280"}
            />
          </View>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

export default function ActiveWorkoutScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { templateId, workoutId } = useLocalSearchParams<{
    templateId: string;
    workoutId: string;
  }>();
  const { startTimer, stopTimer, resetTimer, checkAndRestoreTimer } =
    useTimerStore();

  const template = useWorkoutStore((state) =>
    state.templates.find((t) => t.id === templateId)
  );
  const workout = template?.workouts.find((w) => w.id === workoutId);
  const currentWorkout = useWorkoutStore((state) => state.currentWorkout);
  const customExercises = useWorkoutStore((state) => state.customExercises);
  const allExercises = [...defaultExercises, ...customExercises];

  const scale = useSharedValue(1);
  const pressScale = useSharedValue(1);
  const scrollY = useSharedValue(0);
  const headerHeight = insets.top; // Height at which timer should be fully transitioned

  // Create active exercises directly from currentWorkout.exerciseData
  const activeExercises = currentWorkout?.exerciseData
    ? Object.entries(currentWorkout.exerciseData).map(([id, data]) => ({
        id,
        name: data.name,
        bodyPart: data.bodyPart,
        sets: data.sets,
        reps: data.reps,
      }))
    : [];

  const [exerciseSets, setExerciseSets] = useState<Record<string, SetData[]>>(
    {}
  );
  const [localInputs, setLocalInputs] = useState<
    Record<
      string,
      Record<number, { weight: string; reps: string; rpe: string }>
    >
  >({});
  const [showQuitDialog, setShowQuitDialog] = useState(false);
  const [removingSet, setRemovingSet] = useState<{
    exerciseId: string;
    setIndex: number;
  } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const positions = useSharedValue(
    Object.fromEntries(
      activeExercises.map((exercise, index) => [exercise.id, index])
    )
  );
  const [showFinishDialog, setShowFinishDialog] = useState(false);

  // Cleanup function for unmounting
  useEffect(() => {
    return () => {
      // Reset local state
      setExerciseSets({});
      setLocalInputs({});
      // Only stop timer if we're actually quitting
      if (showQuitDialog) {
        stopTimer();
        resetTimer();
      }
      setShowQuitDialog(false);
    };
  }, []);

  // Initialize exercise sets from current workout if it exists
  useEffect(() => {
    if (currentWorkout) {
      // Use all exercises from currentWorkout
      const filteredSets: Record<string, SetData[]> = {};
      Object.entries(currentWorkout.exercises).forEach(([exerciseId, sets]) => {
        filteredSets[exerciseId] = sets;
      });
      setExerciseSets(filteredSets);
    } else if (workout) {
      const initialSets: Record<string, SetData[]> = {};
      workout.exercises.forEach((exercise) => {
        initialSets[exercise.id] = Array(exercise.sets)
          .fill(null)
          .map(() => ({ weight: 0, reps: exercise.reps, rpe: 0 }));
      });
      setExerciseSets(initialSets);
    }

    // Cleanup function
    return () => {
      setExerciseSets({});
    };
  }, [currentWorkout, workout]);

  // Initialize local inputs from exerciseSets
  useEffect(() => {
    setLocalInputs(initializeLocalInputs(exerciseSets));

    // Cleanup function
    return () => {
      setLocalInputs({});
    };
  }, [exerciseSets]);

  // Initialize timer when component mounts
  useEffect(() => {
    let isMounted = true;

    const initTimer = async () => {
      if (!isMounted) return;
      if (currentWorkout) {
        await checkAndRestoreTimer();
        // Only start timer if it's not already running
        if (!useTimerStore.getState().isRunning) {
          startTimer();
        }
      }
    };

    initTimer();

    return () => {
      isMounted = false;
    };
  }, [currentWorkout]);

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (nextAppState === "active") {
          // Restore timer state when app becomes active
          await checkAndRestoreTimer();
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const handleSetInputChange = useCallback(
    (
      exerciseId: string,
      setIndex: number,
      field: "weight" | "reps" | "rpe",
      value: string
    ) => {
      handleInputChange(exerciseId, setIndex, field, value, setLocalInputs);
    },
    []
  );

  const handleSetInputBlur = useCallback(
    (
      exerciseId: string,
      setIndex: number,
      field: "weight" | "reps" | "rpe",
      value: string
    ) => {
      handleInputBlur(
        exerciseId,
        setIndex,
        field,
        value,
        setExerciseSets,
        currentWorkout,
        templateId,
        workoutId
      );
    },
    [currentWorkout, templateId, workoutId]
  );

  const handleSetAdd = useCallback(
    (exerciseId: string) => {
      if (workout) {
        handleAddSet(
          exerciseId,
          exerciseSets,
          workout,
          setExerciseSets,
          setLocalInputs,
          currentWorkout,
          templateId,
          workoutId
        );
      }
    },
    [workout, exerciseSets, currentWorkout, templateId, workoutId]
  );

  const handleSetRemove = useCallback(
    (exerciseId: string, setIndex: number) => {
      handleRemoveSet(
        exerciseId,
        setIndex,
        setExerciseSets,
        currentWorkout,
        templateId,
        workoutId,
        setLocalInputs
      );
    },
    [currentWorkout, templateId, workoutId]
  );

  const handleComplete = useCallback(() => {
    if (!template || !workout) return;
    stopTimer();
    resetTimer();
    handleWorkoutComplete(exerciseSets, template, workout, router);
  }, [exerciseSets, template, workout, router]);

  const handleLeaveWorkout = useCallback(() => {
    setShowQuitDialog(true);
  }, []);

  const handleConfirmQuit = useCallback(() => {
    setShowQuitDialog(false);
    stopTimer();
    resetTimer();
    handleWorkoutLeave(router);
  }, [router]);

  const handleRemoveExercise = useCallback((exerciseId: string) => {
    // Remove from workout store and local state
    handleWorkoutRemoveExercise(exerciseId, setExerciseSets, setLocalInputs);
  }, []);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollY.value = event.nativeEvent.contentOffset.y;
    },
    []
  );

  // Add this function to handle exercise reordering
  const handleReorderComplete = useCallback(() => {
    // Get the new order of exercises based on positions
    const newOrder = Object.entries(positions.value)
      .sort(([, a], [, b]) => a - b)
      .map(([id]) => id);

    // Update the workout store with the new order
    useWorkoutStore.getState().reorderExercises(newOrder);
    setIsEditMode(false);
  }, [positions]);

  if (!template || !workout) {
    return <WorkoutNotFound isDarkMode={isDarkMode} />;
  }

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <Animated.View
        className={`${isDarkMode ? "bg-gray-900" : "bg-white"}`}
        style={[
          useAnimatedStyle(() => {
            const translateY = interpolate(
              scrollY.value,
              [0, headerHeight],
              [0, -headerHeight * 2],
              Extrapolate.CLAMP
            );
            return {
              transform: [{ translateY }],
            };
          }),
        ]}
      >
        <View className="px-4 py-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-4">
              <TouchableOpacity
                onPress={handleLeaveWorkout}
                className={`h-10 w-10 items-center justify-center rounded-full ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <MaterialIcons
                  name="close"
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
            <TouchableOpacity
              onPress={handleComplete}
              className={`h-10 px-4 items-center justify-center rounded-full ${
                isDarkMode ? "bg-white" : "bg-black"
              }`}
            >
              <Text
                className={`font-medium ${
                  isDarkMode ? "text-black" : "text-white"
                }`}
              >
                Finish
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Timer Container */}
      <Animated.View
        style={[
          useAnimatedStyle(() => {
            const height = interpolate(
              scrollY.value,
              [0, headerHeight],
              [120, 0],
              Extrapolate.CLAMP
            );
            return {
              height,
              overflow: "hidden",
            };
          }),
        ]}
      >
        {/* Timer Section - Full Size */}
        <Animated.View
          className={`px-4 py-6 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
          style={[
            isDarkMode ? {} : styles.lightShadow,
            useAnimatedStyle(() => {
              const opacity = interpolate(
                scrollY.value,
                [0, headerHeight],
                [1, 0],
                Extrapolate.CLAMP
              );
              return {
                opacity,
              };
            }),
          ]}
        >
          <WorkoutTimer />
        </Animated.View>
      </Animated.View>

      {/* Floating Timer - Compact */}
      <Animated.View
        className="absolute right-4 z-50"
        style={[
          styles.floatingTimer,
          useAnimatedStyle(() => {
            const opacity = interpolate(
              scrollY.value,
              [0, headerHeight],
              [0, 1],
              Extrapolate.CLAMP
            );
            const translateY = interpolate(
              scrollY.value,
              [0, headerHeight],
              [100, insets.top + 10],
              Extrapolate.CLAMP
            );
            return {
              opacity,
              transform: [{ translateY }],
            };
          }),
        ]}
      >
        <View
          className={`px-4 py-2 rounded-full ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
          style={styles.floatingShadow}
        >
          <WorkoutTimer compact />
        </View>
      </Animated.View>

      {/* Floating Finish Button */}
      <Animated.View
        style={[
          styles.floatingFinish,
          useAnimatedStyle(() => {
            const opacity = interpolate(
              scrollY.value,
              [0, headerHeight],
              [0, 1],
              Extrapolate.CLAMP
            );
            return {
              opacity,
            };
          }),
        ]}
      >
        <TouchableOpacity
          onPress={() => setShowFinishDialog(true)}
          className={`h-14 w-14 items-center justify-center rounded-full ${
            isDarkMode ? "bg-white" : "bg-black"
          }`}
          style={styles.floatingShadow}
        >
          <MaterialIcons
            name="check"
            size={28}
            color={isDarkMode ? "#000" : "#fff"}
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Exercise List Header */}
      <View className="px-4 py-4">
        <View className="flex-row items-center justify-between">
          <Text
            className={`text-lg font-medium ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Exercises
          </Text>
          <View className="flex-row gap-2">
            {!isEditMode && (
              <TouchableOpacity
                className={`flex-row items-center gap-2 py-2 px-3 rounded-full ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-100"
                }`}
                onPress={() => setIsEditMode(true)}
              >
                <MaterialIcons
                  name="reorder"
                  size={20}
                  color={isDarkMode ? "#fff" : "#000"}
                />
                <Text
                  className={`font-medium ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Reorder
                </Text>
              </TouchableOpacity>
            )}
            {isEditMode ? (
              <TouchableOpacity
                className={`flex-row items-center gap-2 py-2 px-3 rounded-full ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-100"
                }`}
                onPress={handleReorderComplete}
              >
                <MaterialIcons
                  name="check"
                  size={20}
                  color={isDarkMode ? "#fff" : "#000"}
                />
                <Text
                  className={`font-medium ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Done
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className={`flex-row items-center gap-2 py-2 px-3 rounded-full ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-100"
                }`}
                onPress={() => router.push("/workout/exercises")}
              >
                <MaterialIcons
                  name="add"
                  size={20}
                  color={isDarkMode ? "#fff" : "#000"}
                />
                <Text
                  className={`font-medium ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Add Exercise
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Exercise List */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        scrollEnabled={!isEditMode}
      >
        <View
          style={{
            height: isEditMode ? activeExercises.length * 56 + 16 : "auto",
            paddingBottom: 24,
          }}
        >
          {isEditMode ? (
            <View style={{ position: "relative" }}>
              {activeExercises.map((exercise, index) => (
                <DraggableExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  positions={positions}
                  scrollY={scrollY}
                  isDarkMode={isDarkMode}
                  index={index}
                  count={activeExercises.length}
                />
              ))}
            </View>
          ) : (
            <View className="gap-4 px-4">
              {activeExercises.map((exercise, index) => (
                <Animated.View
                  key={exercise.id}
                  entering={FadeIn.delay(index * 100)}
                  layout={Layout.springify()}
                  className={`p-5 rounded-2xl overflow-hidden ${
                    isDarkMode ? "bg-gray-800/80" : "bg-white"
                  }`}
                  style={isDarkMode ? {} : styles.lightShadow}
                >
                  {/* Decorative Circle */}
                  <View
                    className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10"
                    style={{
                      backgroundColor: isDarkMode ? "#ffffff" : "#000000",
                    }}
                  />

                  {/* Exercise Header */}
                  <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-1">
                      <Text
                        className={`text-lg font-medium ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {exercise.name}
                      </Text>
                      <Text
                        className={`text-sm mt-1 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {exerciseSets[exercise.id]?.length || 0} sets completed
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleRemoveExercise(exercise.id)}
                      className={`h-8 w-8 items-center justify-center rounded-full ${
                        isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
                      }`}
                    >
                      <MaterialIcons
                        name="close"
                        size={20}
                        color={isDarkMode ? "#9CA3AF" : "#6B7280"}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Sets */}
                  <View className="gap-3">
                    {exerciseSets[exercise.id]?.map((set, setIndex) => (
                      <Animated.View
                        key={setIndex}
                        entering={SlideInRight.delay(setIndex * 50)}
                        exiting={SlideOutRight}
                        layout={Layout.springify()}
                        className={`flex-row items-center gap-3 p-3 rounded-xl ${
                          isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
                        }`}
                      >
                        <Text
                          className={`w-8 text-center font-medium ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {setIndex + 1}
                        </Text>
                        <View className="flex-1 flex-row items-center gap-3">
                          <View className="flex-1">
                            <TextInput
                              value={
                                localInputs[exercise.id]?.[setIndex]?.weight
                              }
                              onChangeText={(value) =>
                                handleSetInputChange(
                                  exercise.id,
                                  setIndex,
                                  "weight",
                                  value
                                )
                              }
                              onBlur={() =>
                                handleSetInputBlur(
                                  exercise.id,
                                  setIndex,
                                  "weight",
                                  localInputs[exercise.id]?.[setIndex]
                                    ?.weight || ""
                                )
                              }
                              keyboardType="numeric"
                              placeholder="0"
                              placeholderTextColor={
                                isDarkMode ? "#6B7280" : "#9CA3AF"
                              }
                              className={`text-base text-center py-2 px-3 rounded-lg ${
                                isDarkMode
                                  ? "bg-gray-800 text-white"
                                  : "bg-white text-gray-900"
                              }`}
                            />
                            <Text
                              className={`text-xs text-center mt-1 ${
                                isDarkMode ? "text-gray-500" : "text-gray-400"
                              }`}
                            >
                              kg
                            </Text>
                          </View>
                          <View className="flex-1">
                            <TextInput
                              value={localInputs[exercise.id]?.[setIndex]?.reps}
                              onChangeText={(value) =>
                                handleSetInputChange(
                                  exercise.id,
                                  setIndex,
                                  "reps",
                                  value
                                )
                              }
                              onBlur={() =>
                                handleSetInputBlur(
                                  exercise.id,
                                  setIndex,
                                  "reps",
                                  localInputs[exercise.id]?.[setIndex]?.reps ||
                                    ""
                                )
                              }
                              keyboardType="numeric"
                              placeholder="0"
                              placeholderTextColor={
                                isDarkMode ? "#6B7280" : "#9CA3AF"
                              }
                              className={`text-base text-center py-2 px-3 rounded-lg ${
                                isDarkMode
                                  ? "bg-gray-800 text-white"
                                  : "bg-white text-gray-900"
                              }`}
                            />
                            <Text
                              className={`text-xs text-center mt-1 ${
                                isDarkMode ? "text-gray-500" : "text-gray-400"
                              }`}
                            >
                              reps
                            </Text>
                          </View>
                          <View className="flex-1">
                            <TextInput
                              value={localInputs[exercise.id]?.[setIndex]?.rpe}
                              onChangeText={(value) =>
                                handleSetInputChange(
                                  exercise.id,
                                  setIndex,
                                  "rpe",
                                  value
                                )
                              }
                              onBlur={() =>
                                handleSetInputBlur(
                                  exercise.id,
                                  setIndex,
                                  "rpe",
                                  localInputs[exercise.id]?.[setIndex]?.rpe ||
                                    ""
                                )
                              }
                              keyboardType="numeric"
                              placeholder="0"
                              placeholderTextColor={
                                isDarkMode ? "#6B7280" : "#9CA3AF"
                              }
                              className={`text-base text-center py-2 px-3 rounded-lg ${
                                isDarkMode
                                  ? "bg-gray-800 text-white"
                                  : "bg-white text-gray-900"
                              }`}
                              maxLength={2}
                            />
                            <Text
                              className={`text-xs text-center mt-1 ${
                                isDarkMode ? "text-gray-500" : "text-gray-400"
                              }`}
                            >
                              RPE
                            </Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleSetRemove(exercise.id, setIndex)}
                          className={`h-8 w-8 items-center justify-center rounded-full ${
                            isDarkMode ? "bg-gray-800" : "bg-white"
                          }`}
                        >
                          <MaterialIcons
                            name="remove"
                            size={20}
                            color={isDarkMode ? "#9CA3AF" : "#6B7280"}
                          />
                        </TouchableOpacity>
                      </Animated.View>
                    ))}
                  </View>

                  {/* Add Set Button */}
                  <TouchableOpacity
                    onPress={() => handleSetAdd(exercise.id)}
                    className={`mt-3 flex-row items-center justify-center py-3 rounded-xl ${
                      isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
                    }`}
                  >
                    <MaterialIcons
                      name="add"
                      size={20}
                      color={isDarkMode ? "#fff" : "#000"}
                    />
                    <Text
                      className={`ml-2 font-medium ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Add Set
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <FinishWorkoutDialog
        visible={showFinishDialog}
        onClose={() => setShowFinishDialog(false)}
        onConfirm={handleComplete}
        isDarkMode={isDarkMode}
      />
      <QuitWorkoutDialog
        visible={showQuitDialog}
        onClose={() => setShowQuitDialog(false)}
        onConfirm={handleConfirmQuit}
        isDarkMode={isDarkMode}
      />
    </SafeAreaView>
  );
}
