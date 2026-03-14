import React, { memo, useMemo, useCallback } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
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

  /* ---------- Render Item ---------- */

  const renderItem = useCallback(
    ({ item }) => {
      if (item.empty) {
        return (
          <View
            className="border-r border-b"
            style={{
              width: '14.28%',
              aspectRatio: 1,
              borderColor: colors.border + '50',
            }}
          />
        );
      }

      const dateObj = item.data.fullDateObj;

      const isSelected = dateObj.toDateString() === selectedKey;

      return (
        <CalendarDay
          date={dateObj.getDate()}
          isSelected={isSelected}
          isSunday={dateObj.getDay() === 0}
          onPress={() => onSelectDate(item.data)}
          colors={colors}
        />
      );
    },
    [selectedKey, onSelectDate, colors],
  );

  /* ---------- Key Extractor ---------- */

  const keyExtractor = useCallback(item => item.id, []);

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
              style={{
                backgroundColor: isSunday
                  ? colors.pillRed + '20'
                  : 'transparent',
              }}
            >
              <Text
                className="text-xs font-bold"
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
    [colors],
  );

  /* ---------- UI ---------- */

  if (loading && !monthData.length) {
    return (
      <View className="mb-8 py-10 items-center justify-center">
        <ActivityIndicator size="small" color={colors.saffron} />
      </View>
    );
  }

  return (
    <View className="mb-8">
      <View
        className="border rounded-2xl overflow-hidden shadow-sm"
        style={{
          backgroundColor: colors.cardBg,
          borderColor: colors.border,
        }}
      >
        {header}

        <FlatList
          data={gridData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={7}
          scrollEnabled={false}
          removeClippedSubviews
          initialNumToRender={42}
          maxToRenderPerBatch={42}
          windowSize={5}
          getItemLayout={(_, index) => ({
            length: 50,
            offset: 50 * index,
            index,
          })}
        />
      </View>
    </View>
  );
});
