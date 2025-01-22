import { View } from "react-native";
import { Text } from "../../components/Text";
import { MaterialIcons } from "@expo/vector-icons";

export function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center p-4 space-y-4">
      <View className="bg-blue-50 rounded-full p-4">
        <MaterialIcons name="fitness-center" size={32} color="#3b82f6" />
      </View>
      <View className="space-y-2">
        <Text
          variant="bold"
          className="text-xl font-bold text-gray-900 text-center"
        >
          No Templates Yet
        </Text>
        <Text variant="regular" className="text-base text-gray-500 text-center">
          Create your first workout template to get started
        </Text>
      </View>
    </View>
  );
}
