import React, { useState } from "react";
import { View, TouchableOpacity, TextInput } from "react-native";
import { Text } from "../../components/Text";
import { MaterialIcons } from "@expo/vector-icons";
import { useThemeStore } from "../../store/themeStore";
import { PersonalBest } from "../../store/workoutStore";
import { FlashList } from "@shopify/flash-list";

interface PersonalRecordsProps {
  personalBests: PersonalBest[];
  onResetData: () => void;
}

const RecordItem = ({
  record,
  isDarkMode,
}: {
  record: PersonalBest;
  isDarkMode: boolean;
}) => (
  <View
    className={`p-4 rounded-xl mb-3 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
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
        className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
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
);

export const PersonalRecords = ({
  personalBests,
  onResetData,
}: PersonalRecordsProps) => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecords = personalBests.filter(
    (record) =>
      record.weight >= 1 &&
      (record.exerciseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.bodyPart.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const renderItem = ({ item }: { item: PersonalBest }) => (
    <RecordItem record={item} isDarkMode={isDarkMode} />
  );

  const ListHeader = () => (
    <View className="space-y-4 mb-4">
      <View className="flex-row justify-between items-center">
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

      <View
        className={`flex-row items-center px-4 py-2 rounded-lg ${
          isDarkMode ? "bg-gray-800" : "bg-gray-100"
        }`}
      >
        <MaterialIcons
          name="search"
          size={20}
          color={isDarkMode ? "#9ca3af" : "#6b7280"}
        />
        <TextInput
          placeholder="Search exercises..."
          placeholderTextColor={isDarkMode ? "#9ca3af" : "#6b7280"}
          value={searchQuery}
          onChangeText={handleSearchChange}
          className={`flex-1 ml-2 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch}>
            <MaterialIcons
              name="close"
              size={20}
              color={isDarkMode ? "#9ca3af" : "#6b7280"}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const keyExtractor = (item: PersonalBest) => item.id;

  return (
    <View className="px-6">
      <FlashList
        data={filteredRecords}
        renderItem={renderItem}
        estimatedItemSize={100}
        ListHeaderComponent={ListHeader}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
