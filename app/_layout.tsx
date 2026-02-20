import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { CartProvider } from "./providers/CartContext";
import { ThemeProviderCustom } from "./providers/ThemeContext";
import { CheckoutSelectionProvider } from "./providers/CheckoutContext";
import { ToastProvider } from "./providers/ToastContext";

export const unstable_settings = {
  anchor: "(tabs)",
};

const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#FFFFFF",
    card: "#FFFFFF",
    text: "#111111",
    border: "#E5E5E5",
    primary: "#7C3AED",
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={LightTheme}>
      <ThemeProviderCustom>
        <ToastProvider>
          <CartProvider>
            <CheckoutSelectionProvider>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
            </CheckoutSelectionProvider>
            <StatusBar style="dark" />
          </CartProvider>
        </ToastProvider>
      </ThemeProviderCustom>
    </ThemeProvider>
  );
}
