import { View } from "react-native";
import { Text } from "../../components";
import { MaterialIcons } from "@expo/vector-icons";

interface EmptyStateProps {
  icon?: keyof typeof MaterialIcons.glyphMap;
  title?: string;
  message: string;
}

export function EmptyState({
  icon = "fitness-center",
  title,
  message,
}: EmptyStateProps) {
  return (
    <View className="py-8 items-center bg-gray-50 rounded-2xl">
      <MaterialIcons
        name={icon}
        size={48}
        color="#94a3b8"
        style={{ marginBottom: 12 }}
      />
      {title && (
        <Text variant="bold" className="text-lg font-medium text-gray-900 mb-1">
          {title}
        </Text>
      )}
      <Text variant="regular" className="text-gray-500 text-center">
        {message}
      </Text>
    </View>
  );
}
