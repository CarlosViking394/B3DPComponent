import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@rneui/themed';
import { View } from 'react-native';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export default function RootLayout() {
  useEffect(() => {
    window.frameworkReady?.();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <View style={{ flex: 1 }}>
          <StatusBar style="auto" />
          <Stack screenOptions={{
            contentStyle: {
              paddingTop: 0,
              paddingBottom: 0
            }
          }}>
            <Stack.Screen name="+not-found" />
          </Stack>
        </View>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
