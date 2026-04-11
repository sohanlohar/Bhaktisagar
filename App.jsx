import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';

import { BookmarkProvider } from './src/context/BookmarkContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

import RootNavigator from './src/navigation/RootNavigator';

const AppContent = React.memo(() => {
  const { isDarkMode, colors } = useTheme();

  /* ---------- Navigation Theme (memoized) ---------- */

  const navTheme = useMemo(() => ({
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.cardBg,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  }), [isDarkMode, colors]);

  // NOTE:
  // Avoid heavy synchronous/CPU work on app startup to keep navigation responsive.

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <NavigationContainer theme={navTheme}>
        <RootNavigator />
      </NavigationContainer>
    </View>
  );
});

import ErrorBoundary from './src/components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ThemeProvider>
            <BookmarkProvider>
              <AppContent />
            </BookmarkProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}