import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from './ThemeContext';
import { Moon, Sun } from 'lucide-react-native';

interface ThemeToggleProps {
  style?: object;
}

export function ThemeToggle({ style }: ThemeToggleProps) {
  const { isDarkMode, toggleTheme, theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.card }, style]}>
      <View style={styles.content}>
        <View style={styles.iconTextContainer}>
          {isDarkMode ? (
            <Moon size={24} color={theme.text} style={styles.icon} />
          ) : (
            <Sun size={24} color={theme.text} style={styles.icon} />
          )}
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: theme.text }]}>
              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </Text>
            <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
              {isDarkMode
                ? 'Switch to light mode'
                : 'Switch to dark mode'}
            </Text>
          </View>
        </View>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: theme.accent }}
          thumbColor="#f4f3f4"
          ios_backgroundColor="#767577"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
  },
  textContainer: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
}); 