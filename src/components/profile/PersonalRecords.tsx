import React, { memo, useCallback } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "../../components/Text";
import { MaterialIcons } from "@expo/vector-icons";
import { useThemeStore } from "../../store/themeStore";
import { PersonalBest } from "../../store/workoutStore";
import { FlashList } from "@shopify/flash-list";

interface PersonalRecordsProps {
  personalBests: PersonalBest[];
  onResetData: () => void;
}

const RecordItem = memo(
  ({ record, isDarkMode }: { record: PersonalBest; isDarkMode: boolean }) => (
    <View
      className={`p-4 rounded-xl mb-3 ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text
          variant="medium"
          className={`text-base font-medium ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {record.exerciseName}
        </Text>
        <Text
          variant="regular"
          className={`text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {new Date(record.date).toLocaleDateString()}
        </Text>
      </View>
      <View className="flex-row items-center">
        <Text
          variant="bold"
          className={`text-lg font-semibold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {record.weight}kg × {record.reps}
        </Text>
        <Text
          variant="regular"
          className={`text-sm ml-2 ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {record.bodyPart}
        </Text>
      </View>
    </View>
  )
);

export const PersonalRecords = memo(
  ({ personalBests, onResetData }: PersonalRecordsProps) => {
    const isDarkMode = useThemeStore((state) => state.isDarkMode);

    const renderItem = useCallback(
      ({ item }: { item: PersonalBest }) => (
        <RecordItem record={item} isDarkMode={isDarkMode} />
      ),
      [isDarkMode]
    );

    const ListHeader = useCallback(
      () => (
        <View className="flex-row justify-between items-center mb-4">
          <Text
            variant="bold"
            className={`text-base font-semibold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Personal Records
          </Text>
          <TouchableOpacity
            onPress={onResetData}
            className={`p-2 rounded-lg ${
              isDarkMode ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <MaterialIcons
              name="refresh"
              size={20}
              color={isDarkMode ? "#9ca3af" : "#4b5563"}
            />
          </TouchableOpacity>
        </View>
      ),
      [isDarkMode, onResetData]
    );

    const keyExtractor = useCallback((item: PersonalBest) => item.id, []);

    return (
      <View className="px-6">
        <FlashList
          data={personalBests}
          renderItem={renderItem}
          estimatedItemSize={100}
          ListHeaderComponent={ListHeader}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }
);
