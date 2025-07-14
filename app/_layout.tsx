import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Asset } from "expo-asset";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import 'react-native-reanimated';

export default function RootLayout() {
  useEffect(() => {
    Asset.loadAsync(require("@/assets/images/Logo.png"));
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack
          screenOptions={{ headerShown: false }} />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
