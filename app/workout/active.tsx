import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useThemeStore } from "../../src/store/themeStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSharedValue } from "react-native-reanimated";
import { WorkoutNotFound } from "../../src/components/active/WorkoutNotFound";
import { QuitWorkoutDialog } from "../../src/components/active/QuitWorkoutDialog";
import { FinishWorkoutDialog } from "../../src/components/active/FinishWorkoutDialog";
import { WorkoutHeader } from "../../src/components/active/WorkoutHeader";
import { TimerContainer } from "../../src/components/active/TimerContainer";
import { FloatingFinishButton } from "../../src/components/active/FloatingFinishButton";
import { ExerciseListHeader } from "../../src/components/active/ExerciseListHeader";
import { ExerciseList } from "../../src/components/active/ExerciseList";
import { useWorkoutLogic } from "../../src/components/active/hooks/useWorkoutLogic";
import { useExerciseReorder } from "../../src/components/active/hooks/useExerciseReorder";

export default function ActiveWorkoutScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { templateId, workoutId } = useLocalSearchParams<{
    templateId: string;
    workoutId: string;
  }>();

  const scrollY = useSharedValue(0);
  const headerHeight = insets.top;

  const {
    exerciseSets,
    localInputs,
    showQuitDialog,
    showFinishDialog,
    isEditMode,
    template,
    workout,
    currentWorkout,
    setShowQuitDialog,
    setShowFinishDialog,
    setIsEditMode,
    handleSetInputChange,
    handleSetInputBlur,
    handleSetAdd,
    handleSetRemove,
    handleComplete,
    handleLeaveWorkout,
    handleConfirmQuit,
    handleRemoveExercise,
  } = useWorkoutLogic({
    templateId: templateId || "",
    workoutId: workoutId || "",
    router,
  });

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

  const { positions, handleReorderComplete } = useExerciseReorder({
    activeExercises,
    setIsEditMode,
  });

  const handleScroll = (event: any) => {
    scrollY.value = event.nativeEvent.contentOffset.y;
  };

  if (!template || !workout) {
    return <WorkoutNotFound isDarkMode={isDarkMode} />;
  }

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <WorkoutHeader
        isDarkMode={isDarkMode}
        workoutName={workout.name}
        headerHeight={headerHeight}
        scrollY={scrollY}
        onLeaveWorkout={handleLeaveWorkout}
        onComplete={handleComplete}
      />

      <TimerContainer
        isDarkMode={isDarkMode}
        headerHeight={headerHeight}
        scrollY={scrollY}
        insetTop={insets.top}
      />

      <FloatingFinishButton
        isDarkMode={isDarkMode}
        headerHeight={headerHeight}
        scrollY={scrollY}
        onPress={() => setShowFinishDialog(true)}
      />

      <ExerciseListHeader
        isDarkMode={isDarkMode}
        isEditMode={isEditMode}
        onEditModeToggle={setIsEditMode}
        onReorderComplete={handleReorderComplete}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        scrollEnabled={!isEditMode}
      >
        <ExerciseList
          isDarkMode={isDarkMode}
          isEditMode={isEditMode}
          activeExercises={activeExercises}
          exerciseSets={exerciseSets}
          localInputs={localInputs}
          positions={positions}
          scrollY={scrollY}
          onSetInputChange={handleSetInputChange}
          onSetInputBlur={handleSetInputBlur}
          onSetAdd={handleSetAdd}
          onSetRemove={handleSetRemove}
          onRemoveExercise={handleRemoveExercise}
        />
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
