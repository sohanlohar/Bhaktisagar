import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import React, { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';

import { BookmarkProvider } from './src/context/BookmarkContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

import RootNavigator from './src/navigation/RootNavigator';
import { preCalculateYearPanchang } from './src/services/panchangApi';
import { preloadScreens } from './src/utils/preloadScreens';

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

  /* ---------- Background Panchang Precalculation ---------- */

  useEffect(() => {

    const timer = setTimeout(() => {

      // run heavy tasks after app UI loads
      preCalculateYearPanchang(new Date().getFullYear());

      // preloadScreens();

    }, 2000); // delay so app opens instantly

    return () => clearTimeout(timer);

  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <NavigationContainer theme={navTheme}>
        <RootNavigator />
      </NavigationContainer>
    </View>
  );
});

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <BookmarkProvider>
            <AppContent />
          </BookmarkProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}