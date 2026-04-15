import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

import ScreenWrapper from '../components/ScreenWrapper';
import { getTodayPanchang } from '../services/panchangApi';
import { useTheme } from '../context/ThemeContext';

import { ChevronLeft, ChevronRight } from 'lucide-react-native';

import { BhaktiHeader } from '../components/home/BhaktiHeader';
import { CalendarGrid } from '../components/panchang/CalendarGrid';
import { PanchangDetails } from '../components/panchang/PanchangDetails';
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
  const [error, setError] = useState(null);

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

  const requestIdRef = React.useRef(0);
  const monthRequestIdRef = React.useRef(0);

  const fetchDetailedDay = useCallback(async (date) => {

    const requestId = ++requestIdRef.current;

    setDetailLoading(true);

    setError(null);

    setSelectedDateObj(date);

    try {

      const data = await getTodayPanchang(date);

      // Ignore stale responses when date/month changes quickly.
      if (requestIdRef.current !== requestId) return;

      setSelectedData(data);

    } catch (err) {

      if (requestIdRef.current !== requestId) return;

      console.error("Panchang fetch error", err);

      setError("पंचांग विवरण लोड नहीं हो सका। कृपया पुनः प्रयास करें।");

    } finally {

      if (requestIdRef.current === requestId) {
        setDetailLoading(false);
      }

    }

  }, []);

  const displayDateRef = React.useRef(displayDate);
  React.useEffect(() => {
    displayDateRef.current = displayDate;
  }, [displayDate]);

  /* ---------- Load Month ---------- */

  const loadMonthData = useCallback(async (targetDate, force = false) => {
    const monthRequestId = ++monthRequestIdRef.current;
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

    // Apply only if this is still the latest month request.
    if (monthRequestIdRef.current !== monthRequestId) return;
    setMonthData(grid);

    await fetchDetailedDay(initialDate);

    if (monthRequestIdRef.current !== monthRequestId) return;
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
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        <BhaktiHeader navigation={navigation} />

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View className="px-5 py-2">
            {/* Header */}

            <View className="mb-6 mt-2 flex flex-row items-center justify-between">
              <Text
                className="text-[30px] font-pbold leading-[38px]"
                style={{ color: colors.text }}
              >
                पंचांग
              </Text>
              <Text
                className="mt-1 text-[13px] font-pmedium leading-[18px]"
                style={{ color: colors.saffron }}
              >
                {selectedData?.date}
              </Text>
            </View>

            {/* Month Selector */}

            <View className="flex-row items-center justify-between mb-4 px-2">
              <TouchableOpacity
                onPress={() => changeMonth(-1)}
                className="p-2 rounded-full border"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.border,
                }}
              >
                <ChevronLeft size={20} color={colors.text} />
              </TouchableOpacity>

              <Text
                className="text-[16px] font-psemibold leading-[24px]"
                style={{ color: colors.text }}
              >
                {monthTitle}
              </Text>

              <TouchableOpacity
                onPress={() => changeMonth(1)}
                className="p-2 rounded-full border"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.border,
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

            {error && !detailLoading && (
              <View className="px-5 py-2">
                <Text
                  className="text-center"
                  style={{ color: colors.textLight }}
                >
                  {error}
                </Text>
              </View>
            )}
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
