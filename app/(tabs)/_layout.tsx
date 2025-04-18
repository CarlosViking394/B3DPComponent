import { Tabs } from 'expo-router';
import { Home, Upload, Settings } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTheme } from '../../components/ThemeContext';

// Suppress specific warnings
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Task cancellation']);
LogBox.ignoreLogs(['The TypeScript types for Expo Router are not properly']);
LogBox.ignoreLogs(['"Unexpected data" Warning']);
LogBox.ignoreLogs(['Route "./(tabs)/upload/index.tsx" is missing']);

export default function TabLayout() {
  const { theme } = useTheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.tabBarInactive,
        tabBarStyle: {
          backgroundColor: theme.tabBarBackground,
          borderTopColor: theme.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      />

      <Tabs.Screen
        name="upload/index"
        options={{
          title: '3D Upload',
          tabBarLabel: ({ focused, color }) => (
            <Text style={[styles.tabBarLabel, { color }]}>3D Upload</Text>
          ),
          tabBarIcon: ({ color, size }) => <Upload color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});