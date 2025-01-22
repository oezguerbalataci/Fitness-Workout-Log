import { Stack } from "expo-router";

export default function TemplateLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="[id]/workout/[workoutId]"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="new" options={{ headerShown: false }} />
      <Stack.Screen name="new/workout/new" options={{ headerShown: false }} />
      <Stack.Screen name="new/workout/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="edit/[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="edit/[id]/workout/[workoutId]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
