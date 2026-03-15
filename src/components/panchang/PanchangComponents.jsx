import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// Memoized InfoCard to prevent re-renders when other parts of the screen update
export const InfoCard = memo(({ icon: Icon, label, value, color, colors }) => (
  <View
    className="flex-1 rounded-3xl p-4 border m-1 items-center justify-center shadow-sm"
    style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
  >
    <View
      className="w-12 h-12 rounded-full items-center justify-center mb-3"
      style={{ backgroundColor: color + '15' }}
    >
      <Icon size={22} color={color} />
    </View>
    <Text
      className="text-md font-bold tracking-widest mb-1 uppercase"
      style={{ color: colors.textLight }}
    >
      {label}
    </Text>
    <Text
      className="text-md font-bold text-center"
      style={{ color: colors.text }}
    >
      {value}
    </Text>
  </View>
));

// Memoized Day component for the calendar grid
export const CalendarDay = memo(
  ({ date, isSelected, isSunday, onPress, colors }) => {

    const handlePress = () => onPress(date);

    return (
      <TouchableOpacity
        onPress={handlePress}
        style={{
          width: '14.28%',
          aspectRatio: 1,
          backgroundColor: isSelected ? colors.saffron + '20' : 'transparent',
          borderColor: colors.border + '50',
          borderRightWidth: 1,
          borderBottomWidth: 1,
        }}
        className="items-center justify-center p-1"
      >
        <View
          className="w-8 h-8 rounded-full items-center justify-center"
          style={{ backgroundColor: isSelected ? colors.saffron : 'transparent' }}
        >
          <Text
            className="font-bold text-lg"
            style={{
              color: isSelected
                ? '#FFFFFF'
                : isSunday
                  ? colors.pillRed
                  : colors.text,
            }}
          >
            {date}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
);
