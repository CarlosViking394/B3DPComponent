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

interface SliderProps {
    value?: number;
    step?: number;
    minimumValue?: number;
    maximumValue?: number;
    onValueChange?: (value: number) => void;
}

function MySlider({
    value = 0,
    step = 1,
    minimumValue = 0,
    maximumValue = 100,
    onValueChange
}: SliderProps) {
    return <Slider 
        value={value}
        step={step}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        onValueChange={onValueChange}
    />;
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
          <Stack 
            screenOptions={{
              contentStyle: {
                paddingTop: 0,
                paddingBottom: 0
              },
              headerShown: true,
              headerTitle: ""
            }}
          >
            <Stack.Screen 
              name="+not-found" 
              options={{
                headerTitle: "Not Found",
                headerShown: true
              }}
            />
            <Stack.Screen name="materialDetails" />
          </Stack>
        </View>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
