import React, { memo, useMemo, useCallback } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { CalendarDay } from './PanchangComponents';

const DAYS = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

export const CalendarGrid = memo(function CalendarGrid({
  loading,
  monthData,
  selectedDateObj,
  onSelectDate,
  colors,
}) {
  /* ---------- Selected Key ---------- */

  const selectedKey = useMemo(
    () => selectedDateObj?.toDateString() || '',
    [selectedDateObj],
  );

  /* ---------- Grid Data ---------- */

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

  /* ---------- Day Press Handler ---------- */

  const handleDayPress = useCallback((date) => {
    // Find the item by date
    const item = monthData.find(d => d.fullDateObj.getDate() === date);
    if (item) {
      onSelectDate(item);
    }
  }, [monthData, onSelectDate]);

  /* ---------- Render Cells ---------- */

  const cells = useMemo(() => {
    return gridData.map((item, index) => {
      if (item.empty) {
        return (
          <View
            key={`empty-${index}`}
            className="w-[14.28%] aspect-square border-r border-b"
            style={{ borderColor: colors.border + '50' }}
          />
        );
      }

      const dateObj = item.data.fullDateObj;
      const isSelected = dateObj.toDateString() === selectedKey;

      return (
        <CalendarDay
          key={`day-${dateObj.getDate()}`}
          date={dateObj.getDate()}
          isSelected={isSelected}
          isSunday={dateObj.getDay() === 0}
          onPress={handleDayPress}
          colors={colors}
        />
      );
    });
  }, [gridData, selectedKey, handleDayPress, colors]);

  /* ---------- Header ---------- */

  const header = useMemo(
    () => (
      <View
        className="flex-row border-b"
        style={{ borderBottomColor: colors.border }}
      >
        {DAYS.map((day, idx) => {
          const isSunday = idx === 0;

          return (
            <View
              key={day}
              className="flex-1 py-3 items-center justify-center"
              style={isSunday ? { backgroundColor: colors.pillRed + '20' } : {}}
            >
              <Text
                className="text-sm font-pbold"
                style={{
                  color: isSunday ? colors.pillRed : colors.textLight,
                }}
              >
                {day}
              </Text>
            </View>
          );
        })}
      </View>
    ),
    [colors.border, colors.pillRed, colors.textLight],
  );

  /* ---------- UI ---------- */

  const content = useMemo(() => {
    if (loading && !monthData.length) {
      return (
        <View className="py-20 items-center justify-center">
          <ActivityIndicator size="large" color={colors.saffron} />
        </View>
      );
    }

    return (
      <View className="flex-row flex-wrap">
        {cells}

        {loading && monthData.length > 0 && (
          <View
            className="absolute inset-0 items-center justify-center z-10"
            style={{ backgroundColor: colors.cardBg + '90' }}
          >
            <ActivityIndicator size="large" color={colors.saffron} />
          </View>
        )}
      </View>
    );
  }, [loading, monthData.length, cells, colors.saffron, colors.cardBg]);

  return (
    <View className="mb-8">
      <View
        className="border-l border-t rounded-2xl overflow-hidden shadow-sm"
        style={{
          backgroundColor: colors.cardBg,
          borderColor: colors.border,
        }}
      >
        {header}
        {content}
      </View>
    </View>
  );
});
