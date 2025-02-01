import { Modal, View, TouchableOpacity } from "react-native";
import { Text } from "../../components";
import { MaterialIcons } from "@expo/vector-icons";

interface FinishWorkoutDialogProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDarkMode: boolean;
}

export function FinishWorkoutDialog({
  visible,
  onClose,
  onConfirm,
  isDarkMode,
}: FinishWorkoutDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
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
              name="check-circle"
              size={48}
              color={isDarkMode ? "#60A5FA" : "#2563EB"}
            />
          </View>
          <Text
            variant="bold"
            className={`text-xl text-center mb-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Finish Workout?
          </Text>
          <Text
            variant="regular"
            className={`text-center mb-6 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Are you sure you want to finish this workout? This action cannot be
            undone.
          </Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onClose}
              className={`flex-1 py-3 rounded-xl ${
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <Text
                variant="medium"
                className={`text-center ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              className={`flex-1 py-3 rounded-xl ${
                isDarkMode ? "bg-blue-500" : "bg-blue-600"
              }`}
            >
              <Text variant="medium" className="text-center text-white">
                Finish
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
