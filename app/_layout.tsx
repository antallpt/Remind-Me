import { Asset } from "expo-asset";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  useEffect(() => {
    Asset.loadAsync(require("@/assets/images/Logo.png"));
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}
