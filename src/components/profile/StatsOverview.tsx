import React, { memo } from "react";
import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "../../components/Text";
import { useThemeStore } from "../../store/themeStore";

interface StatsOverviewProps {
  personalBestsCount: number;
  workoutLogsCount: number;
}

export const StatsOverview = memo(
  ({ personalBestsCount, workoutLogsCount }: StatsOverviewProps) => {
    const isDarkMode = useThemeStore((state) => state.isDarkMode);

    return (
      <View className="px-6 py-4">
        <Text
          variant="bold"
          className={`text-base font-semibold mb-4 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Overview
        </Text>
        <View className="flex-row justify-between">
          <View
            className={`flex-1 p-4 rounded-xl mr-2 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <Text
              variant="bold"
              className={`text-2xl font-bold mb-1 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {personalBestsCount}
            </Text>
            <Text
              variant="regular"
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Personal Records
            </Text>
          </View>
          <View
            className={`flex-1 p-4 rounded-xl ml-2 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <Text
              variant="bold"
              className={`text-2xl font-bold mb-1 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {workoutLogsCount}
            </Text>
            <Text
              variant="regular"
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Workouts Completed
            </Text>
          </View>
        </View>
      </View>
    );
  }
);
