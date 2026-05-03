import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  InteractionManager,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect, LinearGradient } from 'react-native-svg';

import ScreenWrapper from '../components/ScreenWrapper';
import { getTodayPanchang } from '../services/panchangApi';
import { useTheme } from '../context/ThemeContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react-native';

import { CalendarGrid } from '../components/panchang/CalendarGrid';
import { PanchangDetails } from '../components/panchang/PanchangDetails';
import { useFocusEffect } from '@react-navigation/native';
import { APP_LAYOUT } from '../theme/layout';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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

  const requestIdRef = React.useRef(0);
  const monthRequestIdRef = React.useRef(0);

  const generateMonthGrid = useCallback((year, month) => {
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => ({
      fullDateObj: new Date(year, month, i + 1),
    }));
  }, []);

  // 🔥 FIXED: Smooth detail loading (no flicker)
  const fetchDetailedDay = useCallback(async (date) => {
    const requestId = ++requestIdRef.current;

    // Immediately update selected date for fast UI response
    setSelectedDateObj(date);
    setDetailLoading(true);
    setError(null);

    try {
      const data = await getTodayPanchang(date);

      if (requestIdRef.current !== requestId) return;

      // 🔥 smooth update after UI interactions, bundled with LayoutAnimation
      InteractionManager.runAfterInteractions(() => {
        LayoutAnimation.configureNext(
          LayoutAnimation.create(
            250,
            LayoutAnimation.Types.easeInEaseOut,
            LayoutAnimation.Properties.opacity
          )
        );
        setSelectedData(data);
        setDetailLoading(false); // Update loading state together with data to prevent flicker
      });

    } catch (err) {
      if (requestIdRef.current !== requestId) return;
      setError("पंचांग विवरण लोड नहीं हो सका।");
      setDetailLoading(false);
    }
  }, []);

  const displayDateRef = React.useRef(displayDate);
  useEffect(() => {
    displayDateRef.current = displayDate;
  }, [displayDate]);

  const loadMonthData = useCallback(async (targetDate) => {
    const id = ++monthRequestIdRef.current;

    InteractionManager.runAfterInteractions(async () => {
      setLoading(true);

      const finalTarget = targetDate || displayDateRef.current;
      const year = finalTarget.getFullYear();
      const month = finalTarget.getMonth();

      const grid = generateMonthGrid(year, month);

      if (monthRequestIdRef.current !== id) return;
      setMonthData(grid);

      await fetchDetailedDay(finalTarget);

      if (monthRequestIdRef.current !== id) return;
      setLoading(false);
    });
  }, [generateMonthGrid, fetchDetailedDay]);

  useFocusEffect(
    useCallback(() => {
      const today = new Date();
      setDisplayDate(today);
      loadMonthData(today);
    }, [loadMonthData])
  );

  const handleSelectDate = useCallback((item) => {
    fetchDetailedDay(item.fullDateObj);
  }, [fetchDetailedDay]);

  const changeMonth = useCallback((offset) => {
    const newDate = new Date(displayDate);
    newDate.setMonth(displayDate.getMonth() + offset);
    setDisplayDate(newDate);
    loadMonthData(newDate);
  }, [displayDate, loadMonthData]);

  const monthTitle = useMemo(() => {
    return `${HINDI_MONTHS[displayDate.getMonth()]} ${displayDate.getFullYear()}`;
  }, [displayDate]);

  return (
    <ScreenWrapper>
      <View className="flex-1" style={{ backgroundColor: colors.background }}>

        {/* Header */}
        <View style={styles.headerContainer}>
          <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
            <Defs>
              <LinearGradient id="panchangGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor={colors.saffron} />
                <Stop offset="100%" stopColor={colors.orange} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#panchangGrad)" />
          </Svg>

          <View className="flex-row items-center justify-between px-6 h-full">
            <View className="flex-row items-center">
              <CalendarIcon color="#fff" size={24} />
              <Text className="ml-3 text-xl font-pbold text-white">पंचांग</Text>
            </View>

            <View className="bg-white/20 px-3 py-1 rounded-full">
              <Text className="text-white font-pbold text-xs">
                {selectedData?.date || '--'}
              </Text>
            </View>
          </View>
        </View>

        {/* Body */}
        <ScrollView showsVerticalScrollIndicator={false}>

          <View className="px-5">

            {/* Month */}
            <View style={styles.monthSelector} className="flex-row justify-between my-6 px-4 py-3 rounded-3xl">
              <TouchableOpacity onPress={() => changeMonth(-1)}>
                <ChevronLeft size={20} color={colors.saffron} />
              </TouchableOpacity>

              <Text style={{ color: colors.text }}>{monthTitle}</Text>

              <TouchableOpacity onPress={() => changeMonth(1)}>
                <ChevronRight size={20} color={colors.saffron} />
              </TouchableOpacity>
            </View>

            <CalendarGrid
              loading={loading}
              monthData={monthData}
              selectedDateObj={selectedDateObj}
              onSelectDate={handleSelectDate}
              colors={colors}
            />

            {/* 🔥 FIX: No flicker wrapper */}
            <View style={[styles.detailsWrapper, { minHeight: 350 }]}>

              <PanchangDetails
                detailLoading={false} // ❗ disable internal loader
                selectedData={selectedData}
                colors={colors}
              />

              {/* 🔥 Overlay Loader */}
              {detailLoading && (
                <View style={[
                  styles.loaderOverlay, 
                  { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.6)' }
                ]}>
                  <ActivityIndicator size="large" color={colors.saffron} />
                </View>
              )}
            </View>

          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: APP_LAYOUT.headerHeight + 20,
    overflow: 'hidden',
  },
  monthSelector: {
    backgroundColor: '#fff',
  },
  detailsWrapper: {
    position: 'relative',
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderRadius: 16,
  },
});