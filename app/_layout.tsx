import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider as RNeUIThemeProvider } from '@rneui/themed';
import { View, Platform } from 'react-native';
import { Slider } from '@rneui/themed';
import { ThemeProvider, useTheme } from '../components/ThemeContext';

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

// Wrap the layout with our custom ThemeProvider
function AppLayout() {
  const { theme } = useTheme();
  
  useEffect(() => {
    window.frameworkReady?.();
  }, []);

  const headerStyle = {
    backgroundColor: theme.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    ...Platform.select({
      ios: {
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  };

  return (
    <SafeAreaProvider>
      <RNeUIThemeProvider>
        <View style={{ flex: 1, backgroundColor: theme.background }}>
          <StatusBar style="light" />
          <Stack 
            screenOptions={{
              contentStyle: {
                paddingTop: 0,
                paddingBottom: 0,
                backgroundColor: theme.background,
              },
              headerShown: true,
              headerTitle: "",
              headerStyle: headerStyle,
              headerTintColor: theme.text,
              headerShadowVisible: true,
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen 
              name="+not-found" 
              options={{
                headerTitle: "Not Found",
                headerShown: true
              }}
            />
            <Stack.Screen 
              name="materialDetails" 
              options={{
                headerBackTitle: "Back",
                headerTitleStyle: {
                  color: theme.text,
                  fontSize: 18,
                  fontWeight: '500',
                },
              }}
            />
            <Stack.Screen 
              name="profile" 
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </View>
      </RNeUIThemeProvider>
    </SafeAreaProvider>
  );
}

// Root layout with ThemeProvider wrapper
export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppLayout />
    </ThemeProvider>
  );
}
