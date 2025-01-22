import { Link, Stack } from "expo-router";
import { View } from "react-native";
import { Text } from "../src/components/Text";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View>
        <Text variant="bold">This screen doesn't exist.</Text>

        <Link href="/">
          <Text variant="regular">Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
