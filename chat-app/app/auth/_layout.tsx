import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function AuthLayout() {
  return (
  <Stack screenOptions={{ headerShown: true }}>
    <Stack.Screen name="index" options={{ title: "signup"}}></Stack.Screen>
    <StatusBar style='auto' />
  </Stack>)
}