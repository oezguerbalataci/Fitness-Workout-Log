import { View } from "react-native";
import { Text } from "../shared/Text";

export function Header() {
  return (
    <View>
      <Text variant="medium" className="text-xl font-medium text-gray-900">
        Templates
      </Text>
    </View>
  );
}
