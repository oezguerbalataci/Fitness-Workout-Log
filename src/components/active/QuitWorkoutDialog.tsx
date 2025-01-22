import { View, Modal, TouchableOpacity } from "react-native";
import { Text } from "../Text";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

interface QuitWorkoutDialogProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDarkMode: boolean;
}

export const QuitWorkoutDialog = ({
  visible,
  onClose,
  onConfirm,
  isDarkMode,
}: QuitWorkoutDialogProps) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View
          className={`mx-4 p-6 rounded-2xl ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <View className="items-center mb-4">
            <MaterialIcons
              name="warning"
              size={48}
              color={isDarkMode ? "#f87171" : "#ef4444"}
            />
          </View>

          <Text
            variant="bold"
            className={`text-xl text-center mb-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Quit Workout?
          </Text>

          <Text
            variant="regular"
            className={`text-base text-center mb-6 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Are you sure you want to quit this workout? Your progress will not
            be saved.
          </Text>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onClose}
              className={`flex-1 py-3 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <Text
                variant="medium"
                className={`text-center ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              className="flex-1 py-3 rounded-lg bg-red-500"
            >
              <Text variant="medium" className="text-center text-white">
                Quit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
