import React, { useCallback } from "react";
import { View, TouchableOpacity, FlatList } from "react-native";
import { Text } from "../../components/Text";
import { MaterialIcons } from "@expo/vector-icons";
import { useThemeStore } from "../../store/themeStore";
import { PersonalBest } from "../../store/workoutStore";

interface PersonalRecordsProps {
  personalBests: PersonalBest[];
  onResetData: () => void;
  ListHeaderComponent?: React.ComponentType<any>;
}

const RecordItem = React.memo(
  ({ record, isDarkMode }: { record: PersonalBest; isDarkMode: boolean }) => (
    <View
      className={`mx-3 mb-3 p-4 rounded-xl shadow-sm ${
        isDarkMode
          ? "bg-gray-800/90 shadow-gray-900"
          : "bg-white shadow-gray-100"
      }`}
      style={{
        transform: [{ scale: 1 }],
      }}
    >
      {/* Exercise Name and Stats Row */}
      <View className="flex-row items-center justify-between">
        <View className="flex-1 mr-3">
          <Text
            variant="bold"
            className={`text-base ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {record.exerciseName}
          </Text>
          <Text
            variant="regular"
            className={`text-xs mt-0.5 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {record.bodyPart} • {new Date(record.date).toLocaleDateString()}
          </Text>
        </View>

        {/* Weight and Reps Badge */}
        <View
          className={`px-3 py-2 rounded-lg ${
            isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
          }`}
        >
          <Text
            variant="bold"
            className={`text-center text-base ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {record.weight}
            <Text
              variant="medium"
              className={`text-xs ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {" "}
              kg
            </Text>
          </Text>
          <Text
            variant="medium"
            className={`text-center text-xs mt-0.5 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {record.reps} reps
          </Text>
        </View>
      </View>
    </View>
  )
);

export const PersonalRecords = ({
  personalBests,
  onResetData,
  ListHeaderComponent,
}: PersonalRecordsProps) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  const renderItem = useCallback(
    ({ item }: { item: PersonalBest }) => (
      <RecordItem record={item} isDarkMode={isDarkMode} />
    ),
    [isDarkMode]
  );

  const ListEmptyComponent = useCallback(
    () => (
      <View className="py-8 items-center">
        <Text
          variant="medium"
          className={`text-base ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          No personal records yet
        </Text>
      </View>
    ),
    [isDarkMode]
  );

  const HeaderComponent = useCallback(
    () => (
      <>
        {ListHeaderComponent && <ListHeaderComponent />}
        <View className="px-4 flex-row justify-between items-center mb-3">
          <Text
            variant="bold"
            className={`text-base ${
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
              size={18}
              color={isDarkMode ? "#9ca3af" : "#4b5563"}
            />
          </TouchableOpacity>
        </View>
      </>
    ),
    [isDarkMode, onResetData, ListHeaderComponent]
  );

  return (
    <FlatList
      data={personalBests}
      renderItem={renderItem}
      keyExtractor={(item) => `${item.exerciseName}-${item.date}`}
      ListHeaderComponent={HeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
};
