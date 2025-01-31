import { View, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWorkoutStore } from "../../src/store/workoutStore";
import { useThemeStore } from "../../src/store/themeStore";
import { Stack } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Calendar, DateData } from "react-native-calendars";
import { useState, useMemo, useCallback } from "react";
import { FlashList } from "@shopify/flash-list";
import React from "react";

type MarkedDates = {
  [date: string]: {
    marked?: boolean;
    dotColor?: string;
    selected?: boolean;
    selectedColor?: string;
  };
};

// Memoized date formatting function
const formatDate = (date: number) => new Date(date).toISOString().split("T")[0];

// Get today's date in the same format as formatDate
const getTodayDate = () => new Date().toISOString().split("T")[0];

const WorkoutLogItem = ({
  log,
  isDarkMode,
}: {
  log: any;
  isDarkMode: boolean;
}) => (
  <View
    className={`${
      isDarkMode ? "bg-gray-800" : "bg-white"
    } p-4 rounded-xl border ${
      isDarkMode ? "border-gray-700" : "border-gray-100"
    } mx-6`}
  >
    <View className="flex-row justify-between items-center mb-4">
      <View>
        <Text
          className={`text-lg font-semibold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {log.workoutName}
        </Text>
        <Text
          className={`text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {log.templateName}
        </Text>
      </View>
      <Text
        className={`text-sm ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
      >
        {new Date(log.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </View>

    <View className="space-y-3">
      {log.exercises.map((exercise: any) => (
        <View key={exercise.id}>
          <Text
            className={`text-base font-medium ${
              isDarkMode ? "text-white" : "text-gray-900"
            } mb-2`}
          >
            {exercise.name}
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {exercise.sets.map((set: any, index: number) => (
              <View key={index}>
                <Text
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {set.weight}kg × {set.reps}
                  {set.rpe ? ` @${set.rpe}` : ""}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>

    <View
      className={`mt-4 pt-4 border-t ${
        isDarkMode ? "border-gray-700" : "border-gray-100"
      } flex-row items-center`}
    >
      <MaterialIcons
        name="timer"
        size={16}
        color={isDarkMode ? "#9ca3af" : "#94A3B8"}
      />
      <Text
        className={`text-sm ${
          isDarkMode ? "text-gray-400" : "text-gray-500"
        } ml-2`}
      >
        {Math.round(log.duration / 1000 / 60)} minutes
      </Text>
    </View>
  </View>
);

const EmptyList = React.memo(
  ({
    isDarkMode,
    selectedDate,
  }: {
    isDarkMode: boolean;
    selectedDate: string | null;
  }) => (
    <View
      className={`py-12 items-center mx-6 ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } rounded-2xl border ${
        isDarkMode ? "border-gray-700" : "border-gray-100"
      }`}
    >
      <View
        className={`${
          isDarkMode ? "bg-gray-700" : "bg-gray-50"
        } w-16 h-16 rounded-full items-center justify-center mb-4`}
      >
        <MaterialIcons
          name="fitness-center"
          size={32}
          color={isDarkMode ? "#9ca3af" : "#94A3B8"}
        />
      </View>
      <Text
        className={`text-base font-medium ${
          isDarkMode ? "text-white" : "text-gray-900"
        } mb-2`}
      >
        {selectedDate ? "No workouts on this day" : "No workouts yet"}
      </Text>
      <Text
        className={`text-sm ${
          isDarkMode ? "text-gray-400" : "text-gray-500"
        } text-center px-6`}
      >
        {selectedDate
          ? "Try selecting a different date"
          : "Complete your first workout to see it here"}
      </Text>
    </View>
  )
);

export default function LogsScreen() {
  const workoutLogs = useWorkoutStore((state) => state.workoutLogs);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [selectedDate, setSelectedDate] = useState<string | null>(
    getTodayDate()
  );
  const [showCalendar, setShowCalendar] = useState(false);

  // Memoize the workout dates map for better performance
  const workoutDatesMap = useMemo(() => {
    const datesMap = new Map<string, boolean>();
    workoutLogs.forEach((log) => {
      datesMap.set(formatDate(log.date), true);
    });
    return datesMap;
  }, [workoutLogs]);

  // Create a map of dates with workouts for the calendar
  const markedDates = useMemo<MarkedDates>(() => {
    const dates: MarkedDates = {};
    workoutDatesMap.forEach((_, date) => {
      dates[date] = {
        marked: true,
        dotColor: "#3b82f6",
        ...(date === selectedDate && {
          selected: true,
          selectedColor: "#3b82f6",
        }),
      };
    });
    return dates;
  }, [workoutDatesMap, selectedDate]);

  // Memoize the filtered logs
  const filteredLogs = useMemo(() => {
    if (!selectedDate) return workoutLogs;
    return workoutLogs.filter((log) => formatDate(log.date) === selectedDate);
  }, [workoutLogs, selectedDate]);

  // Memoize the calendar press handler
  const handleDayPress = useCallback((day: DateData) => {
    setSelectedDate(day.dateString);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <WorkoutLogItem log={item} isDarkMode={isDarkMode} />
    ),
    [isDarkMode]
  );

  const ListEmptyComponent = useCallback(
    () => <EmptyList isDarkMode={isDarkMode} selectedDate={selectedDate} />,
    [isDarkMode, selectedDate]
  );

  const keyExtractor = useCallback((item: any) => item.id, []);

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
      edges={["bottom", "top"]}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex-1">
        <TouchableOpacity
          onPress={() => setShowCalendar(!showCalendar)}
          className={`flex-row items-center justify-between px-4 py-3 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <Text
            className={`text-lg font-medium ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {selectedDate || "All Workouts"}
          </Text>
          <MaterialIcons
            name={showCalendar ? "expand-less" : "expand-more"}
            size={24}
            color={isDarkMode ? "#fff" : "#000"}
          />
        </TouchableOpacity>

        {showCalendar && (
          <Calendar
            markedDates={markedDates}
            onDayPress={handleDayPress}
            theme={{
              calendarBackground: isDarkMode ? "#1F2937" : "#fff",
              dayTextColor: isDarkMode ? "#fff" : "#000",
              textDisabledColor: isDarkMode ? "#4B5563" : "#9CA3AF",
              monthTextColor: isDarkMode ? "#fff" : "#000",
              textSectionTitleColor: isDarkMode ? "#fff" : "#000",
              selectedDayBackgroundColor: "#3b82f6",
              selectedDayTextColor: "#fff",
              todayTextColor: "#3b82f6",
              arrowColor: isDarkMode ? "#fff" : "#000",
            }}
          />
        )}

        <FlashList
          data={filteredLogs}
          renderItem={renderItem}
          estimatedItemSize={200}
          keyExtractor={keyExtractor}
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={{ paddingVertical: 24 }}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        />
      </View>
    </SafeAreaView>
  );
}
