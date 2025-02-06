import { useState, useEffect, useCallback } from "react";
import { AppState } from "react-native";
import { useWorkoutStore } from "../../../store/workoutStore";
import { useTimerStore } from "../../../store/timerStore";
import { Router } from "expo-router";
import { SetData, LocalInputs } from "../types";
import {
  handleInputChange,
  handleInputBlur,
  handleAddSet,
  handleRemoveSet,
} from "../utils/setUtils";
import {
  handleComplete as handleWorkoutComplete,
  handleLeaveWorkout as handleWorkoutLeave,
  handleRemoveExercise as handleWorkoutRemoveExercise,
} from "../utils/workoutUtils";
import { initializeLocalInputs } from "../utils/initUtils";

interface UseWorkoutLogicProps {
  templateId: string;
  workoutId: string;
  router: Router;
}

export function useWorkoutLogic({
  templateId,
  workoutId,
  router,
}: UseWorkoutLogicProps) {
  const [exerciseSets, setExerciseSets] = useState<Record<string, SetData[]>>({});
  const [localInputs, setLocalInputs] = useState<LocalInputs>({});
  const [showQuitDialog, setShowQuitDialog] = useState(false);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [removingSet, setRemovingSet] = useState<{
    exerciseId: string;
    setIndex: number;
  } | null>(null);

  const { startTimer, stopTimer, resetTimer, checkAndRestoreTimer } =
    useTimerStore();

  const template = useWorkoutStore((state) =>
    state.templates.find((t) => t.id === templateId)
  );
  const workout = template?.workouts.find((w) => w.id === workoutId);
  const currentWorkout = useWorkoutStore((state) => state.currentWorkout);

  // Initialize exercise sets from current workout if it exists
  useEffect(() => {
    let newSets: Record<string, SetData[]> = {};
    if (currentWorkout) {
      Object.entries(currentWorkout.exercises).forEach(([exerciseId, sets]) => {
        newSets[exerciseId] = sets;
      });
    } else if (workout) {
      workout.exercises.forEach((exercise) => {
        newSets[exercise.id] = Array(exercise.sets)
          .fill(null)
          .map(() => ({ weight: 0, reps: exercise.reps, rpe: 0 }));
      });
    }
    setExerciseSets(newSets);
  }, [currentWorkout, workout]);

  // Initialize local inputs from exerciseSets
  useEffect(() => {
    const initialInputs = initializeLocalInputs(exerciseSets);
    setLocalInputs(initialInputs);
  }, [exerciseSets]);

  // Initialize timer when component mounts
  useEffect(() => {
    let isMounted = true;

    const initTimer = async () => {
      if (!isMounted) return;
      if (currentWorkout) {
        await checkAndRestoreTimer();
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
    handleWorkoutRemoveExercise(exerciseId, setExerciseSets, setLocalInputs);
  }, []);

  return {
    exerciseSets,
    localInputs,
    showQuitDialog,
    showFinishDialog,
    isEditMode,
    removingSet,
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
  };
} 