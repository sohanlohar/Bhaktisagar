import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { CalendarDay } from './PanchangComponents';

const isSameDate = (d1, d2) => {
  if (!d1 || !d2) return false;
  return d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();
};

export const CalendarGrid = ({ loading, monthData, selectedDateObj, onSelectDate, colors }) => {
  return (
    <View className="mb-8">
      {loading && monthData.length === 0 ? (
        <View className="py-10 items-center justify-center">
          <ActivityIndicator size="small" color={colors.saffron} />
        </View>
      ) : (
        <View className="border rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
          {/* Days Header */}
          <View className="flex-row border-b" style={{ borderBottomColor: colors.border }}>
            {['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'].map((day, idx) => (
              <View key={idx} className="flex-1 py-3 items-center justify-center" style={{ backgroundColor: idx === 0 ? colors.pillRed + '20' : 'transparent' }}>
                <Text className="text-xs font-bold" style={{ color: idx === 0 ? colors.pillRed : colors.textLight }}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          <View className="flex-row flex-wrap">
            {monthData.length > 0 && Array.from({ length: monthData[0].fullDateObj.getDay() }).map((_, idx) => (
              <View key={`empty-${idx}`} style={{ width: '14.28%', aspectRatio: 1, borderColor: colors.border + '50' }} className="border-r border-b" />
            ))}

            {monthData.map((item, index) => (
              <CalendarDay
                key={index.toString()}
                date={item.fullDateObj.getDate()}
                isSelected={isSameDate(item.fullDateObj, selectedDateObj)}
                isSunday={item.fullDateObj.getDay() === 0}
                onPress={() => onSelectDate(item)}
                colors={colors}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};
