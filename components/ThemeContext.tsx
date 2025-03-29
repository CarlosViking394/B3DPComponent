import React, { createContext, useContext } from 'react';

// Define the dark theme colors
export const darkTheme = {
  background: '#121212',
  surface: '#1E1E1E',
  card: '#242424',
  cardAlt: '#2A2A2A',
  text: '#E1E1E1',
  secondaryText: '#A0A0A0',
  accent: '#0088FF',
  accentLight: '#154B72',
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
  tabBarActive: '#0088FF',
  shadow: 'rgba(0, 0, 0, 0.3)',
  progressBar: '#0088FF',
  progressBackground: '#444444',
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
};

// Theme context
interface ThemeContextType {
  theme: typeof darkTheme;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: darkTheme,
});

// Theme provider component
export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Always use dark theme
  const theme = darkTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = () => useContext(ThemeContext); 