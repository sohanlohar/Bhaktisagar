import React, { memo, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Zap } from 'lucide-react-native';

/* ------------------------------------------------ */
/* GridListItem */
/* ------------------------------------------------ */

export const GridListItem = memo(function GridListItem({
  title,
  icon: Icon,
  color,
  onPress,
}) {
  const { colors } = useTheme();

  const containerStyle = useMemo(
    () => ({
      backgroundColor: colors.white,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    }),
    [colors.white],
  );

  const iconColor = color || colors.orange;

  return (
    <Pressable
      onPress={onPress}
      className="flex-1 flex-row items-center p-3 mb-2 mx-1 rounded-xl border border-gray-100 shadow-sm"
      style={containerStyle}
    >
      <View className="mr-3 w-8 h-8 items-center justify-center rounded-lg bg-gray-50">
        {Icon ? (
          <Icon size={18} color={iconColor} />
        ) : (
          <Zap size={18} color={iconColor} />
        )}
      </View>

      <Text
        className="text-[14px] font-bold flex-1"
        style={{ color: colors.text }}
        numberOfLines={1}
      >
        {title}
      </Text>
    </Pressable>
  );
});

/* ------------------------------------------------ */
/* SubCategoryChip */
/* ------------------------------------------------ */

export const SubCategoryChip = memo(function SubCategoryChip({
  label,
  icon: Icon,
  onPress,
}) {
  const { colors } = useTheme();

  const chipStyle = useMemo(
    () => ({
      backgroundColor: '#F8FAFC',
    }),
    [],
  );

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-4 py-3 mr-3 rounded-2xl border border-gray-100"
      style={chipStyle}
    >
      {Icon && (
        <View className="mr-2">
          <Icon size={18} color={colors.orange} />
        </View>
      )}

      <Text className="text-[14px] font-bold" style={{ color: colors.text }}>
        {label}
      </Text>
    </Pressable>
  );
});
