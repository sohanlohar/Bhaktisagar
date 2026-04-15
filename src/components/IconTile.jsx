import React, { memo, useMemo } from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import AnimatedPressable from './AnimatedPressable';

export const IconTile = memo(function IconTile({
  icon,
  label,
  onPress,
  isNew,
}) {
  const { colors } = useTheme();

  const circleStyle = useMemo(
    () => ({
      borderColor: colors.orange + '44',
    }),
    [colors.orange],
  );

  const squareStyle = useMemo(
    () => ({
      borderColor: colors.orange,
    }),
    [colors.orange],
  );

  return (
    <AnimatedPressable
      onPress={onPress}
      className="items-center mx-2 flex w-20"
    >
      <View className="items-center justify-center mt-2">
        <View className="w-16 h-16 items-center justify-center">
          <View
            className="absolute w-14 h-14 rounded-full border"
            style={circleStyle}
          />

          <View
            className="absolute w-14 h-14 border-2 rounded-2xl"
            style={[
              squareStyle,
              { transform: [{ rotate: '0deg' }] },
            ]}
          />

          <View
            className="absolute w-14 h-14 border-2 rounded-2xl"
            style={[
              squareStyle,
              { transform: [{ rotate: '45deg' }] },
            ]}
          />

          <View className="w-12 h-12 rounded-full items-center justify-center">
            <Text className="text-xl" style={{ color: colors.orange }}>
              {icon}
            </Text>
          </View>
        </View>

        {isNew && (
          <View
            className="absolute top-0 right-0 px-1.5 py-0.5 rounded"
            style={{ backgroundColor: '#16A34A' }}
          >
            <Text className="text-xs font-pbold text-white">NEW</Text>
          </View>
        )}
      </View>

      <Text
        numberOfLines={1}
        className="mt-1 text-sm font-pbold text-center"
        style={{ color: colors.text }}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
});
