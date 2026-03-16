import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

import ScreenWrapper from '../components/ScreenWrapper';
import { getMonthPanchang, getTodayPanchang } from '../services/panchangApi';
import { useTheme } from '../context/ThemeContext';

import { ChevronLeft, ChevronRight } from 'lucide-react-native';

import { BhaktiHeader } from '../components/home/BhaktiHeader';
import { CalendarGrid } from '../components/panchang/CalendarGrid';
import { PanchangDetails } from '../components/panchang/PanchangDetails';
import BhaktiLoader from '../components/BhaktiLoader';
import { useFocusEffect } from '@react-navigation/native';

const HINDI_MONTHS = [
  'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
];

export default function PanchangScreen({ navigation }) {

  const { colors } = useTheme();

  const [selectedDateObj, setSelectedDateObj] = useState(new Date());
  const [selectedData, setSelectedData] = useState(null);
  const [monthData, setMonthData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  const [displayDate, setDisplayDate] = useState(new Date());

  /* ---------- Generate Month Grid ---------- */

  const generateMonthGrid = useCallback((year, month) => {

    const days = new Date(year, month + 1, 0).getDate();

    const grid = [];

    for (let i = 1; i <= days; i++) {
      grid.push({
        fullDateObj: new Date(year, month, i)
      });
    }

    return grid;

  }, []);

  /* ---------- Fetch Panchang Detail ---------- */

  const fetchDetailedDay = useCallback(async (date) => {

    setDetailLoading(true);

    setSelectedDateObj(date);

    try {

      const data = await getTodayPanchang(date);

      setSelectedData(data);

    } catch (err) {

      console.log("Panchang fetch error", err);

    } finally {

      setDetailLoading(false);

    }

  }, []);

  const displayDateRef = React.useRef(displayDate);
  React.useEffect(() => {
    displayDateRef.current = displayDate;
  }, [displayDate]);

  /* ---------- Load Month ---------- */

  const loadMonthData = useCallback(async (targetDate, force = false) => {

    setLoading(true);

    const finalTarget = targetDate || displayDateRef.current;
    const year = finalTarget.getFullYear();
    const month = finalTarget.getMonth();

    const grid = generateMonthGrid(year, month);
    const today = new Date();
    let initialDate = finalTarget;

    // Default to today if it's the current month/year
    if (month === today.getMonth() && year === today.getFullYear()) {
      initialDate = today;
    } else if (finalTarget.getDate() !== 1) {
      // If we're just switching to a different month, default to the 1st
      initialDate = new Date(year, month, 1);
    }

    // Batch updates
    setMonthData(grid);
    await fetchDetailedDay(initialDate);
    setLoading(false);

  }, [generateMonthGrid, fetchDetailedDay]);

  /* ---------- Load Month Effect ---------- */

  useFocusEffect(
    useCallback(() => {
      const today = new Date();
      setDisplayDate(today);
      loadMonthData(today, true);
    }, [loadMonthData])
  );

  /* ---------- Date Select ---------- */

  const handleSelectDate = useCallback((item) => {

    fetchDetailedDay(item.fullDateObj);

  }, [fetchDetailedDay]);

  /* ---------- Month Change ---------- */

  const changeMonth = useCallback((offset) => {

    const newDate = new Date(displayDate);
    newDate.setMonth(displayDate.getMonth() + offset);

    setDisplayDate(newDate);
    loadMonthData(newDate, true);

  }, [displayDate, loadMonthData]);

  /* ---------- Month Title ---------- */

  const monthTitle = useMemo(() => {

    return `${HINDI_MONTHS[displayDate.getMonth()]} ${displayDate.getFullYear()}`;

  }, [displayDate]);

  /* ---------- UI ---------- */

  return (

    <ScreenWrapper>

      <View style={{ flex: 1, backgroundColor: colors.background }}>

        <BhaktiHeader navigation={navigation} />

          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >

            <View className="px-5 py-2">

              {/* Header */}

              <View className="mb-6 mt-2 flex flex-row items-center justify-between">

                <Text
                  className="text-3xl font-bold"
                  style={{ color: colors.text }}
                >
                  पंचांग
                </Text>

                <Text
                  className="text-md font-bold mt-1"
                  style={{ color: colors.saffron }}
                >
                  {selectedData?.date}
                </Text>

              </View>

              {/* Month Selector */}

              <View className="flex-row items-center justify-between mb-4 px-2">

                <TouchableOpacity
                  onPress={() => changeMonth(-1)}
                  className="p-2 rounded-full"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.border,
                    borderWidth: 1
                  }}
                >
                  <ChevronLeft size={20} color={colors.text} />
                </TouchableOpacity>

                <Text
                  className="text-xl font-bold"
                  style={{ color: colors.text }}
                >
                  {monthTitle}
                </Text>

                <TouchableOpacity
                  onPress={() => changeMonth(1)}
                  className="p-2 rounded-full"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.border,
                    borderWidth: 1
                  }}
                >
                  <ChevronRight size={20} color={colors.text} />
                </TouchableOpacity>

              </View>

              {/* Calendar */}

              <CalendarGrid
                loading={loading}
                monthData={monthData}
                selectedDateObj={selectedDateObj}
                onSelectDate={handleSelectDate}
                colors={colors}
              />

              {/* Details */}

              <PanchangDetails
                detailLoading={detailLoading}
                selectedData={selectedData}
                colors={colors}
              />

            </View>

          </ScrollView>

      </View>

    </ScreenWrapper>

  );

}
