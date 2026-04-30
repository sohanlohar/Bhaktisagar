import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, InteractionManager } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect, LinearGradient } from 'react-native-svg';

import ScreenWrapper from '../components/ScreenWrapper';
import { getTodayPanchang } from '../services/panchangApi';
import { useTheme } from '../context/ThemeContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react-native';

import { CalendarGrid } from '../components/panchang/CalendarGrid';
import { PanchangDetails } from '../components/panchang/PanchangDetails';
import { useFocusEffect } from '@react-navigation/native';
import { APP_LAYOUT } from '../theme/layout';

const HINDI_MONTHS = [
  'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
];

export default function PanchangScreen({ navigation }) {
  const { colors, isDarkMode } = useTheme();

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
        grid.push({ fullDateObj: new Date(year, month, i) });
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
  useEffect(() => {
    displayDateRef.current = displayDate;
  }, [displayDate]);

  /* ---------- Load Month ---------- */
  const loadMonthData = useCallback(async (targetDate, force = false) => {
    const monthRequestId = ++monthRequestIdRef.current;
    
    // Defer heavy data loading to after interactions/animations
    InteractionManager.runAfterInteractions(async () => {
        setLoading(true);

        const finalTarget = targetDate || displayDateRef.current;
        const year = finalTarget.getFullYear();
        const month = finalTarget.getMonth();

        const grid = generateMonthGrid(year, month);
        const today = new Date();
        let initialDate = finalTarget;

        if (month === today.getMonth() && year === today.getFullYear()) {
          initialDate = today;
        } else if (finalTarget.getDate() !== 1) {
          initialDate = new Date(year, month, 1);
        }

        if (monthRequestIdRef.current !== monthRequestId) return;
        setMonthData(grid);

        await fetchDetailedDay(initialDate);

        if (monthRequestIdRef.current !== monthRequestId) return;
        setLoading(false);
    });
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

  const monthTitle = useMemo(() => {
    return `${HINDI_MONTHS[displayDate.getMonth()]} ${displayDate.getFullYear()}`;
  }, [displayDate]);

  return (
    <ScreenWrapper>
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        
        {/* Premium Header Container */}
        <View style={styles.headerContainer}>
            <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                <Defs>
                    <LinearGradient id="panchangGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor={colors.saffron} stopOpacity="1" />
                        <Stop offset="100%" stopColor={colors.orange} stopOpacity="1" />
                    </LinearGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#panchangGrad)" />
            </Svg>
            <View className="flex-row items-center justify-between px-6 h-full">
                <View className="flex-row items-center">
                    <CalendarIcon color="#FFFFFF" size={24} />
                    <Text className="ml-3 text-xl font-pbold text-white uppercase tracking-wider">पंचांग</Text>
                </View>
                <View className="bg-white/20 px-3 py-1 rounded-full border border-white/30">
                    <Text className="text-white font-pbold text-xs">{selectedData?.date || '--'}</Text>
                </View>
            </View>
        </View>

        {/* Aura Background */}
        <View className="flex-1">
            <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                <Defs>
                    <RadialGradient id="aura" cx="50%" cy="40%" rx="50%" ry="50%" fx="50%" fy="40%" gradientUnits="userSpaceOnUse">
                        <Stop offset="0%" stopColor={colors.saffron} stopOpacity={isDarkMode ? 0.08 : 0.05} />
                        <Stop offset="100%" stopColor={colors.background} stopOpacity="1" />
                    </RadialGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#aura)" />
            </Svg>

            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              <View className="px-5">
                {/* Month Selector */}
                <View 
                    style={[styles.monthSelector, { backgroundColor: colors.cardBg, borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,153,51,0.1)' }]}
                    className="flex-row items-center justify-between my-6 px-4 py-3 rounded-3xl border shadow-sm"
                >
                  <TouchableOpacity
                    onPress={() => changeMonth(-1)}
                    className="w-10 h-10 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: colors.saffron + '10' }}
                  >
                    <ChevronLeft size={20} color={colors.saffron} />
                  </TouchableOpacity>

                  <Text
                    className="text-[18px] font-pbold"
                    style={{ color: colors.text }}
                  >
                    {monthTitle}
                  </Text>

                  <TouchableOpacity
                    onPress={() => changeMonth(1)}
                    className="w-10 h-10 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: colors.saffron + '10' }}
                  >
                    <ChevronRight size={20} color={colors.saffron} />
                  </TouchableOpacity>
                </View>

                {/* Calendar Grid */}
                <CalendarGrid
                  loading={loading}
                  monthData={monthData}
                  selectedDateObj={selectedDateObj}
                  onSelectDate={handleSelectDate}
                  colors={colors}
                />

                {/* Status / Error */}
                {error && !detailLoading && (
                  <View className="px-5 py-6 items-center">
                    <Text className="text-center font-pmedium text-red-500">{error}</Text>
                  </View>
                )}

                {/* Details Section */}
                <View className="mt-6">
                    <PanchangDetails
                      detailLoading={detailLoading}
                      selectedData={selectedData}
                      colors={colors}
                    />
                </View>
              </View>
            </ScrollView>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
    headerContainer: {
        height: APP_LAYOUT.headerHeight + 20,
        width: '100%',
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
    },
    monthSelector: {
        elevation: 4,
        shadowColor: '#FF9933',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
    }
});

