import React, { useMemo, useCallback } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import { CalendarDay } from './PanchangComponents';

const DAYS = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

export const CalendarGrid = React.memo(function CalendarGrid({
  loading,
  monthData,
  selectedDateObj,
  onSelectDate,
  colors
}) {

  const selectedKey = useMemo(() => {
    return selectedDateObj ? selectedDateObj.toDateString() : '';
  }, [selectedDateObj]);

  // Create grid with empty cells
  const gridData = useMemo(() => {
    if (!monthData.length) return [];

    const emptyCount = monthData[0].fullDateObj.getDay();
    const emptyCells = Array.from({ length: emptyCount }).map((_, i) => ({
      id: `empty-${i}`,
      empty: true
    }));

    const days = monthData.map((item, index) => ({
      id: `day-${index}`,
      empty: false,
      data: item
    }));

    return [...emptyCells, ...days];
  }, [monthData]);

  const renderItem = useCallback(({ item }) => {

    if (item.empty) {
      return (
        <View
          style={{
            width: '14.28%',
            aspectRatio: 1,
            borderColor: colors.border + '50'
          }}
          className="border-r border-b"
        />
      );
    }

    const dateObj = item.data.fullDateObj;

    return (
      <CalendarDay
        date={dateObj.getDate()}
        isSelected={dateObj.toDateString() === selectedKey}
        isSunday={dateObj.getDay() === 0}
        onPress={() => onSelectDate(item.data)}
        colors={colors}
      />
    );

  }, [selectedKey, onSelectDate, colors]);

  return (
    <View className="mb-8">

      {loading && monthData.length === 0 ? (
        <View className="py-10 items-center justify-center">
          <ActivityIndicator size="small" color={colors.saffron} />
        </View>
      ) : (

        <View
          className="border rounded-2xl overflow-hidden shadow-sm"
          style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
        >

          {/* Days Header */}
          <View className="flex-row border-b" style={{ borderBottomColor: colors.border }}>
            {DAYS.map((day, idx) => (
              <View
                key={idx}
                className="flex-1 py-3 items-center justify-center"
                style={{
                  backgroundColor: idx === 0 ? colors.pillRed + '20' : 'transparent'
                }}
              >
                <Text
                  className="text-xs font-bold"
                  style={{
                    color: idx === 0 ? colors.pillRed : colors.textLight
                  }}
                >
                  {day}
                </Text>
              </View>
            ))}
          </View>

          {/* Virtual Grid */}
          <FlatList
            data={gridData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={7}
            scrollEnabled={false}
            removeClippedSubviews
            initialNumToRender={35}
            windowSize={5}
          />

        </View>
      )}
    </View>
  );
});