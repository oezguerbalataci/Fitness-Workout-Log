import React, { useEffect, useCallback, useState, useRef } from "react";
import { View, AppState } from "react-native";
import { Text } from "../Text";
import { useTimerStore } from "../../store/timerStore";
import { useThemeStore } from "../../store/themeStore";
import { useWorkoutStore } from "../../store/workoutStore";

interface WorkoutTimerProps {
  isDarkMode?: boolean;
  compact?: boolean;
}

export function WorkoutTimer({
  isDarkMode: propIsDarkMode,
  compact,
}: WorkoutTimerProps) {
  const {
    elapsedTime,
    isRunning,
    updateElapsedTime,
    checkAndRestoreTimer,
    stopTimer,
  } = useTimerStore();
  const storeIsDarkMode = useThemeStore((state) => state.isDarkMode);
  const isDarkMode = propIsDarkMode ?? storeIsDarkMode;
  const [displayTime, setDisplayTime] = useState(elapsedTime);
  const frameRef = useRef<number>();
  const lastUpdateRef = useRef<number>(Date.now());
  const currentWorkout = useWorkoutStore((state) => state.currentWorkout);

  // Format time helper
  const formatTime = useCallback((ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }, []);

  // Optimized timer update using requestAnimationFrame
  useEffect(() => {
    let isMounted = true;
    const updateTimer = () => {
      if (!isMounted) return;
      if (isRunning && currentWorkout) {
        const now = Date.now();
        if (now - lastUpdateRef.current >= 1000) {
          updateElapsedTime();
          lastUpdateRef.current = now;
        }
        frameRef.current = requestAnimationFrame(updateTimer);
      }
    };

    if (isRunning && currentWorkout) {
      frameRef.current = requestAnimationFrame(updateTimer);
    }

    return () => {
      isMounted = false;
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = undefined;
      }
    };
  }, [isRunning, updateElapsedTime, currentWorkout]);

  // Update display time when elapsed time changes
  useEffect(() => {
    setDisplayTime(elapsedTime);
  }, [elapsedTime]);

  // Check for existing timer on mount and app state changes
  useEffect(() => {
    let isMounted = true;

    const initTimer = async () => {
      if (!isMounted) return;
      const restored = await checkAndRestoreTimer();
      console.log("[WorkoutTimer] Timer restored:", restored);
    };

    initTimer();

    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (!isMounted) return;

        if (nextAppState === "active") {
          const restored = await checkAndRestoreTimer();
          console.log(
            "[WorkoutTimer] Timer restored after app state change:",
            restored
          );
        } else if (
          nextAppState === "background" ||
          nextAppState === "inactive"
        ) {
          if (frameRef.current) {
            cancelAnimationFrame(frameRef.current);
            frameRef.current = undefined;
          }
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.remove();
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = undefined;
      }
    };
  }, []);

  // Stop timer if workout is cleared
  useEffect(() => {
    if (!currentWorkout && isRunning) {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = undefined;
      }
      stopTimer();
    }
  }, [currentWorkout, isRunning, stopTimer]);

  if (compact) {
    return (
      <Text
        variant="medium"
        className={`text-base font-medium ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {formatTime(displayTime)}
      </Text>
    );
  }

  return (
    <View
      className={`rounded-lg p-4 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
    >
      <View className="flex-row items-center justify-center">
        <Text
          variant="bold"
          className={`text-2xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {formatTime(displayTime)}
        </Text>
      </View>
    </View>
  );
}
