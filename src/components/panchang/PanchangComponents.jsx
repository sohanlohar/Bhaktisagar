import React, { memo, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export const InfoCard = memo(({ icon: Icon, label, value, color, colors }) => {
  return (
    <View
      className="flex-1 rounded-3xl p-4 border m-1 items-center justify-center shadow-sm"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.border,
      }}
    >
      <View
        className="w-12 h-12 rounded-full items-center justify-center mb-3"
        style={{ backgroundColor: color + '15' }}
      >
        <Icon size={22} color={color} />
      </View>
      <Text
        className="text-base font-pbold tracking-wider mb-1 uppercase"
        style={{ color: colors.textLight }}
      >
        {label}
      </Text>
      <Text
        className="text-base font-pbold text-center"
        style={{ color: colors.text }}
      >
        {value}
      </Text>
    </View>
  );
});

export const CalendarDay = memo(
  ({ date, isSelected, isSunday, onPress, colors }) => {
    const handlePress = useCallback(() => onPress(date), [onPress, date]);

    const textColor = useMemo(
      () => {
        if (isSelected) return '#FFFFFF';
        if (isSunday) return colors.pillRed;
        return colors.text;
      },
      [colors.pillRed, colors.text, isSunday, isSelected],
    );

    return (
      <TouchableOpacity
        onPress={handlePress}
        className="w-[14.28%] aspect-square border-r border-b items-center justify-center p-1"
        style={{
          backgroundColor: isSelected ? colors.saffron + '20' : 'transparent',
          borderColor: colors.border + '50',
        }}
      >
        <View
          className="w-8 h-8 rounded-full items-center justify-center"
          style={{
            backgroundColor: isSelected ? colors.saffron : 'transparent',
          }}
        >
          <Text
            className="font-pbold"
            style={{ color: textColor }}
          >
            {date}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
);
