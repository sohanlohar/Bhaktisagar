import React, { memo, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Circle } from 'react-native-svg';

export const InfoCard = memo(({ icon: Icon, label, value, color, colors }) => {
  return (
    <View
      className="flex-1 rounded-[24px] p-4 border m-1.5 items-center justify-center shadow-sm"
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBg,
          borderColor: 'rgba(255,153,51,0.1)',
        }
      ]}
    >
      <View
        className="w-12 h-12 rounded-2xl items-center justify-center mb-3"
        style={{ backgroundColor: color + '08' }}
      >
        <Icon size={22} color={color} />
      </View>
      <Text
        className="text-[10px] font-pbold tracking-widest mb-1 uppercase"
        style={{ color: colors.textLight }}
      >
        {label}
      </Text>
      <Text
        className="text-[14px] font-pbold text-center"
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

    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        className="w-[14.28%] aspect-square items-center justify-center p-1"
      >
        <View
          className="w-10 h-10 rounded-2xl items-center justify-center relative overflow-hidden"
          style={[
            styles.dayOuter,
            {
               backgroundColor: isSelected ? 'transparent' : (isSunday ? colors.pillRed + '05' : 'transparent'),
            }
          ]}
        >
          {isSelected && (
              <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                <Defs>
                  <LinearGradient id="selGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor={colors.saffron} stopOpacity="1" />
                    <Stop offset="100%" stopColor={colors.orange} stopOpacity="1" />
                  </LinearGradient>
                </Defs>
                <Circle cx="50%" cy="50%" r="42%" fill="url(#selGrad)" />
              </Svg>
          )}
          
          <Text
            className="font-pbold text-[15px]"
            style={{ 
                color: isSelected ? '#FFFFFF' : (isSunday ? colors.pillRed : colors.text),
                opacity: isSelected ? 1 : (isSunday ? 0.9 : 0.8)
            }}
          >
            {date}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
    card: {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
    },
    dayOuter: {
        // Subtle base for non-selected
    }
});

