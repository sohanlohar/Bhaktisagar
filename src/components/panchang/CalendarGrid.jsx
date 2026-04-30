import React, { memo, useMemo, useCallback } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { CalendarDay } from './PanchangComponents';

const DAYS = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

export const CalendarGrid = memo(function CalendarGrid({
  loading,
  monthData,
  selectedDateObj,
  onSelectDate,
  colors,
}) {
  const selectedKey = useMemo(
    () => selectedDateObj?.toDateString() || '',
    [selectedDateObj],
  );

  const gridData = useMemo(() => {
    if (!monthData?.length) return [];
    const emptyCount = monthData[0].fullDateObj.getDay();
    const emptyCells = Array.from({ length: emptyCount }, (_, i) => ({
      id: `empty-${i}`,
      empty: true,
    }));
    const days = monthData.map((item, index) => ({
      id: `day-${index}`,
      empty: false,
      data: item,
    }));
    return [...emptyCells, ...days];
  }, [monthData]);

  const handleDayPress = useCallback((date) => {
    const item = monthData.find(d => d.fullDateObj.getDate() === date);
    if (item) onSelectDate(item);
  }, [monthData, onSelectDate]);

  const cells = useMemo(() => {
    return gridData.map((item, index) => {
      if (item.empty) {
        return (
          <View
            key={`empty-${index}`}
            className="w-[14.28%] aspect-square items-center justify-center"
          />
        );
      }

      const dateObj = item.data.fullDateObj;
      const isSelected = dateObj.toDateString() === selectedKey;

      return (
        <Animated.View 
            key={`day-${dateObj.getTime()}`}
            entering={FadeInDown.duration(400).delay(index * 10)}
            className="w-[14.28%]"
        >
            <CalendarDay
              date={dateObj.getDate()}
              isSelected={isSelected}
              isSunday={dateObj.getDay() === 0}
              onPress={handleDayPress}
              colors={colors}
            />
        </Animated.View>
      );
    });
  }, [gridData, selectedKey, handleDayPress, colors]);

  const header = useMemo(
    () => (
      <View className="flex-row items-center mb-3 px-2">
        {DAYS.map((day, idx) => {
          const isSunday = idx === 0;
          return (
            <View key={day} className="flex-1 items-center justify-center">
              <Text
                className="text-[12px] font-psemibold"
                style={{ color: isSunday ? colors.orange : colors.textLight }}
              >
                {day}
              </Text>
            </View>
          );
        })}
      </View>
    ),
    [colors.orange, colors.textLight],
  );

  return (
    <View
      className="mb-8 rounded-[28px] border p-3"
      style={{ backgroundColor: colors.cardBg, borderColor: colors.border + '35' }}
    >
      {header}
      <View className="flex-1">
        {loading && !monthData.length ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="small" color={colors.saffron} />
          </View>
        ) : (
          <View className="flex-row flex-wrap">
            {cells}
            {loading && monthData.length > 0 && (
              <View
                className="absolute inset-0 items-center justify-center z-10 rounded-3xl"
                style={{ backgroundColor: 'rgba(255,255,255,0.4)' }}
              >
                <ActivityIndicator size="small" color={colors.saffron} />
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
});

