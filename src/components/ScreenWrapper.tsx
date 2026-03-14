import React, { memo, useMemo } from 'react';
import { View, StatusBar, StatusBarStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

interface ScreenWrapperProps {
  children: React.ReactNode;
  backgroundColor?: string;
  statusBarColor?: string;
  barStyle?: StatusBarStyle;
  edges?: Edge[];
}

/**
 * Optimized universal screen wrapper
 * Handles SafeArea + StatusBar
 */

function ScreenWrapper({
  children,
  backgroundColor,
  statusBarColor,
  barStyle,
  edges = ['top'],
}: ScreenWrapperProps) {
  const { colors, isDarkMode } = useTheme();

  const finalBgColor = backgroundColor || colors.statusBarBg;
  const finalStatusBarColor = statusBarColor || colors.statusBarBg;

  const finalBarStyle =
    barStyle || (isDarkMode ? 'light-content' : 'dark-content');

  const containerStyle = useMemo(
    () => ({
      flex: 1,
      backgroundColor: finalBgColor,
    }),
    [finalBgColor],
  );

  const innerStyle = useMemo(
    () => ({
      flex: 1,
      backgroundColor: colors.background,
    }),
    [colors.background],
  );

  return (
    <View style={containerStyle}>
      <StatusBar
        barStyle={finalBarStyle}
        backgroundColor={finalStatusBarColor}
        translucent
      />

      <SafeAreaView edges={edges} style={{ flex: 1 }}>
        <View style={innerStyle}>{children}</View>
      </SafeAreaView>
    </View>
  );
}

export default memo(ScreenWrapper);
