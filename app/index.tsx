import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { View, Text, ActivityIndicator, StyleSheet, Platform, TouchableOpacity } from 'react-native';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Simulate checking if app is ready, catching any initialization errors
    const timer = setTimeout(() => {
      try {
        // If Android, do some platform-specific checks
        if (Platform.OS === 'android') {
          console.log('Android initialization complete');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing app:', error);
        setHasError(true);
        setIsLoading(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (hasError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Something went wrong</Text>
        <Text style={styles.errorSubText}>
          Please check your connection and try again
        </Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setIsLoading(true);
            setHasError(false);
            // Force reload the app
            setTimeout(() => setIsLoading(false), 1000);
          }}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0088ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 10,
  },
  errorSubText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#0088ff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 