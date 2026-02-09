/**
 * Theme Context
 * 
 * Global state management for dark/light mode using React Context API.
 * Provides smooth theme transitions and localStorage persistence.
 * 
 * Part of the EventBook design system.
 * 
 * @module ThemeContext
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

/**
 * Theme Type
 */
type Theme = 'dark' | 'light';

/**
 * Theme Context Type
 */
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  mounted: boolean;
}

/**
 * Theme Context with default values for SSR
 */
const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
  isDark: true,
  mounted: false,
});

/**
 * Theme Provider Component
 * 
 * Wraps application to provide theme state and toggle functionality.
 * Persists theme preference to localStorage.
 * Dark mode is the default theme.
 * 
 * @param children - Child components to be wrapped
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    setMounted(true);
    
    const storedTheme = localStorage.getItem('eventbook-theme') as Theme | null;
    
    if (storedTheme) {
      setThemeState(storedTheme);
    } else {
      // Default to dark mode
      setThemeState('dark');
    }
  }, []);

  // Apply theme class to document
  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    
    // Remove existing theme class
    root.classList.remove('light', 'dark');
    
    // Add new theme class
    root.classList.add(theme);
    
    // Store preference
    localStorage.setItem('eventbook-theme', theme);
  }, [theme, mounted]);

  /**
   * Toggle between dark and light themes
   */
  const toggleTheme = useCallback(() => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  /**
   * Set specific theme
   */
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const value = {
    theme,
    toggleTheme,
    setTheme,
    isDark: theme === 'dark',
    mounted,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme Hook
 * 
 * Custom hook to access theme context.
 * Now has default values, so it's safe to use before hydration.
 * 
 * @returns Theme context value
 * 
 * @example
 * ```tsx
 * const { theme, toggleTheme, isDark, mounted } = useTheme();
 * ```
 */
export function useTheme(): ThemeContextType {
  return useContext(ThemeContext);
}
