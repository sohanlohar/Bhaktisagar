import React, { useEffect, useState, useMemo, memo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { getMonthPanchang, getTodayPanchang } from '../services/panchangApi';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Wind, Clock, Sparkles, Activity, Sunrise, Sunset, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { BhaktiHeader } from '../components/home/BhaktiHeader';

const HINDI_MONTHS = [
  'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
];

const isSameDate = (d1, d2) => {
  if (!d1 || !d2) return false;
  return d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();
};

// Memoized InfoCard to prevent re-renders when other parts of the screen update
const InfoCard = memo(({ icon: Icon, label, value, color, colors }) => (
  <View className="flex-1 rounded-3xl p-4 border m-1 items-center justify-center shadow-sm" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
    <View className="w-12 h-12 rounded-full items-center justify-center mb-3" style={{ backgroundColor: color + '15' }}>
      <Icon size={22} color={color} />
    </View>
    <Text className="text-md font-bold tracking-widest mb-1 uppercase" style={{ color: colors.textLight }}>{label}</Text>
    <Text className="text-md font-bold text-center" style={{ color: colors.text }}>{value}</Text>
  </View>
));

// Memoized Day component for the calendar grid
const CalendarDay = memo(({ date, isSelected, isSunday, onPress, colors }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      width: '14.28%',
      aspectRatio: 1,
      backgroundColor: isSelected ? colors.saffron + '20' : 'transparent',
      borderColor: colors.border + '50',
      borderRightWidth: 1,
      borderBottomWidth: 1,
    }}
    className="items-center justify-center p-1"
  >
    <View className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: isSelected ? colors.saffron : 'transparent' }}>
      <Text
        className="font-bold text-lg"
        style={{
          color: isSelected
            ? '#FFFFFF'
            : (isSunday ? colors.pillRed : colors.text)
        }}
      >
        {date}
      </Text>
    </View>
  </TouchableOpacity>
));

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
              <View className="mb-8">
                {loading && monthData.length === 0 ? (
                  <View className="py-10 items-center justify-center">
                    <ActivityIndicator size="small" color={colors.saffron} />
                  </View>
                ) : (
                  <View className="border rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                    {/* Days Header */}
                    <View className="flex-row border-b" style={{ borderBottomColor: colors.border }}>
                      {['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'].map((day, idx) => (
                        <View key={idx} className="flex-1 py-3 items-center justify-center" style={{ backgroundColor: idx === 0 ? colors.pillRed + '20' : 'transparent' }}>
                          <Text className="text-xs font-bold" style={{ color: idx === 0 ? colors.pillRed : colors.textLight }}>{day}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Calendar Grid */}
                    <View className="flex-row flex-wrap">
                      {/* Empty slots for the first day of the month */}
                      {monthData.length > 0 && Array.from({ length: monthData[0].fullDateObj.getDay() }).map((_, idx) => (
                        <View key={`empty-${idx}`} style={{ width: '14.28%', aspectRatio: 1, borderColor: colors.border + '50' }} className="border-r border-b" />
                      ))}

                      {/* Actual Days */}
                      {monthData.map((item, index) => (
                        <CalendarDay
                          key={index.toString()}
                          date={item.fullDateObj.getDate()}
                          isSelected={isSameDate(item.fullDateObj, selectedDateObj)}
                          isSunday={item.fullDateObj.getDay() === 0}
                          onPress={() => handleSelectDate(item)}
                          colors={colors}
                        />
                      ))}
                    </View>
                  </View>
                )}
              </View>


              {/* Details Section */}
              {detailLoading ? (
                <View className="py-20 items-center justify-center">
                  <ActivityIndicator size="large" color={colors.saffron} />
                  <Text className="mt-4 text-sm" style={{ color: colors.textLight }}>विवरण लोड हो रहा है...</Text>
                </View>
              ) : selectedData ? (
                <>
                  {/* Section 1: Core Elements */}
                  <Text className="text-lg font-bold mb-4 px-1" style={{ color: colors.text }}>मुख्य विवरण</Text>
                  <View className="flex-row justify-between mb-2">
                    <InfoCard icon={Moon} label="तिथि" value={selectedData.tithi} color={colors.orange} colors={colors} />
                    <InfoCard icon={Sun} label="नक्षत्र" value={selectedData.nakshatra} color={colors.primary} colors={colors} />
                  </View>
                  <View className="flex-row justify-between mb-8">
                    <InfoCard icon={Activity} label="योग" value={selectedData.yoga} color={colors.pillGreen} colors={colors} />
                    <InfoCard icon={Wind} label="करण" value={selectedData.karana} color={colors.textLight} colors={colors} />
                  </View>

                  {/* Section 2: Muhurats */}
                  <Text className="text-lg font-bold mb-4 px-1" style={{ color: colors.text }}>महत्वपूर्ण समय</Text>
                  <View className="rounded-3xl p-6 mb-8 shadow-sm border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                    <View className="flex-row items-center justify-between mb-5 border-b pb-5" style={{ borderBottomColor: colors.border + '50' }}>
                      <View className="flex-row items-center gap-4">
                        <View className="w-12 h-12 rounded-2xl items-center justify-center bg-orange-100 dark:bg-orange-900/30">
                          <Sparkles size={20} color="#f97316" />
                        </View>
                        <View>
                          <Text className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: colors.textLight }}>शुभ मुहूर्त (अभिजित)</Text>
                          <Text className="text-base font-bold" style={{ color: colors.text }}>{selectedData.shubh_muhurat}</Text>
                        </View>
                      </View>
                    </View>
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-4">
                        <View className="w-12 h-12 rounded-2xl items-center justify-center bg-red-100 dark:bg-red-900/30">
                          <Clock size={20} color="#ef4444" />
                        </View>
                        <View>
                          <Text className="text-xs font-bold uppercase tracking-wider text-red-500 mb-1">राहुकाल</Text>
                          <Text className="text-base font-bold" style={{ color: colors.text }}>{selectedData.rahukal}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Section 3: Sun & Moon */}
                  <Text className="text-lg font-bold mb-4 px-1" style={{ color: colors.text }}>सूर्य और चंद्र</Text>
                  <View className="flex-row justify-between mb-4">
                    <View className="flex-1 rounded-3xl p-4 border m-1 flex-row items-center shadow-sm" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                      <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: colors.orange + '15' }}>
                        <Sunrise size={20} color={colors.orange} />
                      </View>
                      <View>
                        <Text className="text-[10px] uppercase font-bold tracking-wider mb-0.5" style={{ color: colors.textLight }}>सूर्योदय</Text>
                        <Text className="text-sm font-bold" style={{ color: colors.text }}>{selectedData.sunrise}</Text>
                      </View>
                    </View>
                    <View className="flex-1 rounded-3xl p-4 border m-1 flex-row items-center shadow-sm" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                      <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: colors.orange + '15' }}>
                        <Sunset size={20} color={colors.orange} />
                      </View>
                      <View>
                        <Text className="text-[10px] uppercase font-bold tracking-wider mb-0.5" style={{ color: colors.textLight }}>सूर्यास्त</Text>
                        <Text className="text-sm font-bold" style={{ color: colors.text }}>{selectedData.sunset}</Text>
                      </View>
                    </View>
                  </View>

                </>
              ) : null}

            </View>
          </ScrollView>
        )}
      </View>
    </ScreenWrapper>
  );
}
