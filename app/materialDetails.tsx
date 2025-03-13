import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { MaterialDetails } from '../components/MaterialDetails';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MaterialDetailsScreen() {
  const { material } = useLocalSearchParams<{ material: string }>();
  
  if (!material) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Material not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: `${material} Details` }} />
      <MaterialDetails materialType={material} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    margin: 20,
    color: '#ff3b30',
  }
}); 