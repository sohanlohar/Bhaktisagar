import React, { memo, useMemo } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
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

  const containerStyle = useMemo(
    () => [styles.container, { backgroundColor }],
    [backgroundColor],
  );

  return (
    <Pressable onPress={onPress} style={containerStyle}>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

export default memo(CategoryPill);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },

  text: {
    fontSize: 14,
    fontWeight: '700',
  },
});
