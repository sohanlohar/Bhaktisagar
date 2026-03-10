import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import AnimatedPressable from './AnimatedPressable';

export function IconTile({ icon, label, onPress, isNew }) {
  const { colors } = useTheme();

  return (
    <AnimatedPressable onPress={onPress} className="items-center mx-2 flex-1 w-20">
      <View className="items-center justify-center mt-2">
        {/* Mandala Ornamental Background */}
        <View className="w-16 h-16 items-center justify-center">
          {/* Layer 1: Base Circle */}
          <View
            className="absolute w-14 h-14 rounded-full"
            style={{ borderColor: colors.orange + '44' }}
          />

          {/* Layer 2: Rotated Squares for Sunburst/Mandala effect */}
          <View
            className="absolute w-14 h-14 border-2 rounded-lg"
            style={{ borderColor: colors.orange, transform: [{ rotate: '0deg' }] }}
          />
          <View
            className="absolute w-14 h-14 border-2 rounded-lg"
            style={{ borderColor: colors.orange, transform: [{ rotate: '45deg' }] }}
          />

          {/* Petal Dots at tips */}
          {/* {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <View
              key={deg}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: colors.orange,
                transform: [
                  { rotate: `${deg}deg` },
                  { translateY: -28 }
                ]
              }}
            />
          ))} */}

          {/* Inner Circle for Icon */}
          <View
            className="w-12 h-12 rounded-full items-center justify-center bg-transparent"
          // style={{ backgroundColor: colors.white }}
          >
            <Text className="text-xl" style={{ color: colors.orange }}>{icon}</Text>
          </View>
        </View>

        {isNew && (
          <View className="absolute -top-1 right-0 bg-green-600 px-1.5 py-0.5 rounded-md shadow-sm">
            <Text className="text-[7px] font-bold text-white uppercase">NEW</Text>
          </View>
        )}
      </View>

      <Text
        numberOfLines={1}
        className="mt-1 text-[14px] font-bold text-center"
        style={{ color: colors.text }}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}
