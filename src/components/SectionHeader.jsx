import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function SectionHeader({ title, onSeeAll }) {
  const { colors, isDarkMode } = useTheme();

  return (
    <View className="px-5 mt-10 mb-4 flex-row items-center justify-between">
      <View className="flex-row items-center">
        <View className="w-1.5 h-6 rounded-full mr-3" style={{ backgroundColor: colors.saffron }} />
        <Text className="text-xl font-bold" style={{ color: colors.text }}>{title}</Text>
      </View>
      {onSeeAll && (
        <Pressable onPress={onSeeAll} className="active:opacity-60 px-3 py-1 bg-white/5 rounded-full" style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.02)' }}>
          <Text className="text-sm font-semibold" style={{ color: colors.saffron }}>सब देखें ›</Text>
        </Pressable>
      )}
    </View>
  );
}
