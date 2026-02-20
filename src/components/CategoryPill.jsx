import React from 'react';
import { Pressable, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function CategoryPill({ label, onPress, color }) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      className={`px-4 py-1.5 rounded-full mr-2 shadow-sm border border-gray-300`}
      style={{
        backgroundColor: color || colors.cardBg,
      }}
    >
      <Text
        className="text-[14px] font-bold"
        style={{ color: color === colors.pillYellow || !color ? colors.text : colors.white }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
