import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
  <Stack screenOptions={{ headerShown: true }}>
    <Stack.Screen name="index" options={{ title: "Root"}}></Stack.Screen>
    <StatusBar style='auto' />
  </Stack>)
}
