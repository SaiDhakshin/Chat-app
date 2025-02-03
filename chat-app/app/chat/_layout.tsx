import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function ChatLayout() {
  return (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="index" options={{ title: "ChatHome"}}></Stack.Screen>
    <Stack.Screen name="[id]" options={{ title: "chat"}}></Stack.Screen>
    <StatusBar style='dark' />
  </Stack>)
}
