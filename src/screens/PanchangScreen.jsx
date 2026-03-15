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

  /* ---------- Load Month ---------- */

  const loadMonthData = useCallback(async (force = false) => {

    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();

    // Skip if already loaded and not forced
    if (!force && monthData.length > 0 && monthData[0].fullDateObj.getMonth() === month && monthData[0].fullDateObj.getFullYear() === year) {
      return;
    }

    const grid = generateMonthGrid(year, month);
    const today = new Date();
    let initialDate = grid[0].fullDateObj;

    if (month === today.getMonth() && year === today.getFullYear()) {
      initialDate = today;
    }

    // Batch updates
    setMonthData(grid);
    fetchDetailedDay(initialDate);
    setLoading(false);

  }, [displayDate, generateMonthGrid, fetchDetailedDay, monthData]);

  /* ---------- Load Month Effect ---------- */

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      // Only show top-level loading if we don't have month data yet
      const year = displayDate.getFullYear();
      const month = displayDate.getMonth();
      const isCorrectMonth = monthData.length > 0 &&
        monthData[0].fullDateObj.getMonth() === month &&
        monthData[0].fullDateObj.getFullYear() === year;

      if (!isCorrectMonth) {
        setLoading(true);

        const timer = setTimeout(() => {
          if (!cancelled) {
            loadMonthData();
          }
        }, 0);

        return () => {
          cancelled = true;
          clearTimeout(timer);
        };
      }
    }, [loadMonthData, monthData, displayDate])
  );

  /* ---------- Date Select ---------- */

  const handleSelectDate = useCallback((item) => {

    fetchDetailedDay(item.fullDateObj);

  }, [fetchDetailedDay]);

  /* ---------- Month Change ---------- */

  const changeMonth = useCallback((offset) => {

    setDisplayDate(prev => {

      const newDate = new Date(prev);

      newDate.setMonth(prev.getMonth() + offset);

      return newDate;

    });

  }, []);

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
