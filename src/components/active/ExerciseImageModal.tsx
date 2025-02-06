import React from "react";
import { Modal, View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Text } from "../Text";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

interface ExerciseImageModalProps {
  isVisible: boolean;
  onClose: () => void;
  imageUrl: string;
  exerciseName: string;
  isDarkMode: boolean;
}

export const ExerciseImageModal = ({
  isVisible,
  onClose,
  imageUrl,
  exerciseName,
  isDarkMode,
}: ExerciseImageModalProps) => {
  if (!imageUrl) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <BlurView
        intensity={90}
        tint={isDarkMode ? "dark" : "light"}
        style={StyleSheet.absoluteFill}
      >
        <View className="flex-1 justify-center items-center p-4">
          <View
            className={`w-full max-w-lg rounded-2xl p-4 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text
                variant="bold"
                className={`text-lg ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {exerciseName}
              </Text>
              <TouchableOpacity
                onPress={onClose}
                className={`p-2 rounded-full ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <MaterialIcons
                  name="close"
                  size={24}
                  color={isDarkMode ? "#fff" : "#000"}
                />
              </TouchableOpacity>
            </View>
            <Image
              source={{ uri: imageUrl }}
              className="w-full h-64 rounded-lg"
              resizeMode="contain"
            />
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};
