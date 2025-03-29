import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';

// Define theme colors
export const lightTheme = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  card: '#FFFFFF',
  text: '#333333',
  secondaryText: '#666666',
  accent: '#4CAF50',
  border: '#EEEEEE',
  error: '#FF3B30',
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#2196F3',
  divider: '#EEEEEE',
  inputBackground: '#F5F5F5',
  modalBackground: 'rgba(0, 0, 0, 0.5)',
  statusBar: 'dark',
  tabBarBackground: '#FFFFFF',
  tabBarInactive: '#CCCCCC',
  tabBarActive: '#4CAF50',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const darkTheme = {
  background: '#121212',
  surface: '#1E1E1E',
  card: '#242424',
  text: '#E1E1E1',
  secondaryText: '#A0A0A0',
  accent: '#4CAF50',
  border: '#333333',
  error: '#FF453A',
  success: '#32D74B',
  warning: '#FFD60A',
  info: '#0A84FF',
  divider: '#333333',
  inputBackground: '#333333',
  modalBackground: 'rgba(0, 0, 0, 0.7)',
  statusBar: 'light',
  tabBarBackground: '#1E1E1E',
  tabBarInactive: '#666666',
  tabBarActive: '#4CAF50',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

// Theme context
interface ThemeContextType {
  theme: typeof lightTheme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setDarkMode: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDarkMode: false,
  toggleTheme: () => {},
  setDarkMode: () => {},
});

// Theme provider component
export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Get device color scheme
  const deviceColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(deviceColorScheme === 'dark');

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Set dark mode directly
  const setDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark);
  };

  // Get current theme
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDarkMode,
        toggleTheme,
        setDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = () => useContext(ThemeContext); 