import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';

import { BookmarkProvider } from './src/context/BookmarkContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

import RootNavigator from './src/navigation/RootNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = [
  { fontFamily: 'Poppins-Regular' },
  Text.defaultProps.style,
];

const AppContent = React.memo(() => {
  const { isDarkMode, isThemeReady, colors } = useTheme();
  const [navReady, setNavReady] = useState(false);

  /* ---------- Navigation Theme (memoized) ---------- */

  const navTheme = useMemo(
    () => ({
      ...(isDarkMode ? DarkTheme : DefaultTheme),
      colors: {
        ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
        background: colors.background,
        card: colors.cardBg,
        text: colors.text,
        border: colors.border,
        primary: colors.primary,
      },
    }),
    [isDarkMode, colors],
  );

  if (!isThemeReady) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <NavigationContainer theme={navTheme} onReady={() => setNavReady(true)}>
        <RootNavigator />
      </NavigationContainer>
      {!navReady && (
        <View
          pointerEvents="none"
          className="absolute inset-0 items-center justify-center"
          style={{ backgroundColor: colors.background }}
        >
          <ActivityIndicator size="small" color={colors.saffron || colors.primary} />
        </View>
      )}
    </View>
  );
});

export default function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView className="flex-1">
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
