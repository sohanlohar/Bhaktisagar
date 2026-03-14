import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Moon, Sun, Wind, Clock, Sparkles, Activity, Sunrise, Sunset } from 'lucide-react-native';
import { InfoCard } from './PanchangComponents';

export const PanchangDetails = ({ detailLoading, selectedData, colors }) => {
  if (detailLoading) {
    return (
      <View className="py-20 items-center justify-center">
        <ActivityIndicator size="large" color={colors.saffron} />
        <Text className="mt-4 text-sm" style={{ color: colors.textLight }}>विवरण लोड हो रहा है...</Text>
      </View>
    );
  }

  if (!selectedData) return null;

  return (
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
  );
};
