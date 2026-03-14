import React, { useEffect, useState, memo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { getMonthPanchang, getTodayPanchang } from '../services/panchangApi';
import { useTheme } from '../context/ThemeContext';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { BhaktiHeader } from '../components/home/BhaktiHeader';
import { CalendarGrid } from '../components/panchang/CalendarGrid';
import { PanchangDetails } from '../components/panchang/PanchangDetails';

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

  // Load month data
  useEffect(() => {
    const handle = requestIdleCallback(() => {
      loadMonthData();
    });
    return () => cancelIdleCallback(handle);
  }, [displayDate]);

  // Load month data
  const loadMonthData = async () => {
    setLoading(true);
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // 1. Generate simple grid dates INSTANTLY (structural only)
    const basicGridData = [];
    for (let i = 1; i <= daysInMonth; i++) {
      basicGridData.push({
        fullDateObj: new Date(year, month, i)
      });
    }

    // 2. Fetch current day's details IMMEDIATELY (critical path)
    const now = new Date();
    let initialSelectedDate = basicGridData[0].fullDateObj;
    if (month === now.getMonth() && year === now.getFullYear()) {
      initialSelectedDate = now;
    }

    // Fetch detail first to ensure we have content before hiding main loader
    await fetchDetailedDay(initialSelectedDate);

    setMonthData(basicGridData);
    setLoading(false);

    // 3. Defer background month caching
    requestIdleCallback(() => {
      getMonthPanchang(year, month);
    });
  };

  const fetchDetailedDay = async (date) => {
    setDetailLoading(true);
    setSelectedDateObj(date);
    const data = await getTodayPanchang(date);
    setSelectedData(data);
    setDetailLoading(false);
  };

  const handleSelectDate = (item) => {
    fetchDetailedDay(item.fullDateObj);
  };

  const changeMonth = (offset) => {
    const newDate = new Date(displayDate);
    newDate.setMonth(displayDate.getMonth() + offset);
    setDisplayDate(newDate);
  };

  return (
    <ScreenWrapper>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <BhaktiHeader navigation={navigation} />
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={colors.saffron} />
            <Text className="mt-4 text-sm font-bold" style={{ color: colors.textLight }}>आज का पंचांग लोड हो रहा है...</Text>
          </View>
        ) : (
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            <View className="px-5 py-2">

              {/* Top Selected Date Header */}
              <View className="mb-6 mt-2">
                <Text className="text-3xl font-bold" style={{ color: colors.text }}>पंचांग</Text>
                <Text className="text-sm font-semibold mt-1" style={{ color: colors.saffron }}>
                  {selectedData?.date}
                </Text>
              </View>

              {/* Month Selector */}
              <View className="flex-row items-center justify-between mb-4 px-2">
                <TouchableOpacity
                  onPress={() => changeMonth(-1)}
                  className="p-2 rounded-full"
                  style={{ backgroundColor: colors.cardBg, borderColor: colors.border, borderWidth: 1 }}
                >
                  <ChevronLeft size={20} color={colors.text} />
                </TouchableOpacity>

                <Text className="text-xl font-bold" style={{ color: colors.text }}>
                  {HINDI_MONTHS[displayDate.getMonth()]} {displayDate.getFullYear()}
                </Text>

                <TouchableOpacity
                  onPress={() => changeMonth(1)}
                  className="p-2 rounded-full"
                  style={{ backgroundColor: colors.cardBg, borderColor: colors.border, borderWidth: 1 }}
                >
                  <ChevronRight size={20} color={colors.text} />
                </TouchableOpacity>
              </View>

              {/* Monthly Calendar Grid View */}
              <CalendarGrid
                loading={loading}
                monthData={monthData}
                selectedDateObj={selectedDateObj}
                onSelectDate={handleSelectDate}
                colors={colors}
              />

              {/* Details Section */}
              <PanchangDetails
                detailLoading={detailLoading}
                selectedData={selectedData}
                colors={colors}
              />

            </View>
          </ScrollView>
        )}
      </View>
    </ScreenWrapper>
  );
}
