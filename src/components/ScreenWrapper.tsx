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
      backgroundColor: finalBgColor,
    }),
    [finalBgColor],
  );

  const innerStyle = useMemo(
    () => ({
      backgroundColor: colors.background,
    }),
    [colors.background],
  );

  return (
    <View className="flex-1" style={containerStyle}>
      <StatusBar
        barStyle={finalBarStyle}
        backgroundColor={finalStatusBarColor}
        translucent
      />

      <SafeAreaView edges={edges} className="flex-1">
        <View className="flex-1" style={innerStyle}>
          {children}
        </View>
      </SafeAreaView>
    </View>
  );
}

export default memo(ScreenWrapper);
