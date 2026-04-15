import React, { memo, useMemo } from 'react';
import { Pressable, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';

function CategoryPill({ label, onPress, color }) {
  const { colors } = useTheme();

  const backgroundColor = color || colors.cardBg;

  const textColor = useMemo(() => {
    if (!color || color === colors.pillYellow) {
      return colors.text;
    }
    return colors.white;
  }, [color, colors]);

  return (
    <Pressable
      onPress={onPress}
      className="px-4 py-1.5 rounded-full mr-2 border"
      style={{
        backgroundColor,
        borderColor: '#D1D5DB',
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 1,
      }}
    >
      <Text className="text-sm font-pbold" style={{ color: textColor }}>{label}</Text>
    </Pressable>
  );
}

export default memo(CategoryPill);
