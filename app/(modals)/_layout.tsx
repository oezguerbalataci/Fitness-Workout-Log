import { Stack } from "expo-router";

export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: "transparentModal",
        animation: "none",
      }}
    >
      <Stack.Screen
        name="workout/[id]"
        options={{
          presentation: "transparentModal",
          animation: "none",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
