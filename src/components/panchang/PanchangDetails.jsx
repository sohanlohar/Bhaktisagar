import React, { memo, useMemo } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import {
  Moon,
  Sun,
  Wind,
  Clock,
  Sparkles,
  Activity,
  Sunrise,
  Sunset,
} from 'lucide-react-native';

import { InfoCard } from './PanchangComponents';

/* ---------- Sub Components ---------- */

const DetailedTithiCard = memo(({ tithiDetailed, samvat, colors }) => {
  if (!tithiDetailed) return null;

  return (
    <View
      className="rounded-[28px] p-6 mb-8 border"
      style={[
        styles.premiumCard,
        {
          backgroundColor: colors.cardBg,
          borderColor: 'rgba(255,153,51,0.1)',
        }
      ]}
    >
      <View className="flex-row items-center mb-5">
        <View
          className="w-10 h-10 rounded-2xl items-center justify-center mr-4"
          style={{ backgroundColor: colors.saffron + '10' }}
        >
          <Moon size={20} color={colors.saffron} />
        </View>
        <Text
          className="text-xs font-pbold uppercase tracking-widest"
          style={{ color: colors.saffron }}
        >
          विस्तृत तिथि विवरण
        </Text>
      </View>

      <Text
        className="text-[15px] leading-6 font-pmedium text-center"
        style={{ color: colors.text }}
      >
        {tithiDetailed}
      </Text>

      {/* Samvat Info */}
      <View
        className="mt-6 pt-5 border-t flex-row flex-wrap gap-y-4 justify-between"
        style={{ borderTopColor: colors.border + '30' }}
      >
        <View className="w-[45%]">
          <Text
            className="text-[10px] uppercase font-pbold mb-1"
            style={{ color: colors.textLight }}
          >
            विक्रम संवत
          </Text>
          <Text className="text-[14px] font-pbold" style={{ color: colors.text }}>
            {samvat?.vikram || '--'}
          </Text>
        </View>

        <View className="w-[45%]">
          <Text
            className="text-[10px] uppercase font-pbold mb-1"
            style={{ color: colors.textLight }}
          >
            शक संवत
          </Text>
          <Text className="text-[14px] font-pbold" style={{ color: colors.text }}>
            {samvat?.shaka || '--'}
          </Text>
        </View>

        <View className="w-[100%]">
          <Text
            className="text-[10px] uppercase font-pbold mb-1"
            style={{ color: colors.textLight }}
          >
            संवत्सर
          </Text>
          <Text className="text-[14px] font-pbold" style={{ color: colors.text }}>
            {samvat?.samvatsara || '--'}
          </Text>
        </View>
      </View>
    </View>
  );
});

export const PanchangDetails = memo(function PanchangDetails({
  detailLoading,
  selectedData,
  colors,
}) {
  const coreCards = useMemo(() => {
    if (!selectedData) return [];
    return [
      { icon: Moon, label: 'तिथि', value: selectedData.tithi, color: colors.orange },
      { icon: Sun, label: 'नक्षत्र', value: selectedData.nakshatra, color: colors.saffron },
      { icon: Activity, label: 'योग', value: selectedData.yoga, color: colors.pillGreen },
      { icon: Wind, label: 'करण', value: selectedData.karana, color: colors.textLight },
    ];
  }, [selectedData, colors]);

  if (detailLoading) {
    return (
      <View className="py-20 items-center justify-center">
        <ActivityIndicator size="small" color={colors.saffron} />
        <Text className="mt-4 text-xs font-pmedium" style={{ color: colors.textLight }}>
          विवरण लोड हो रहा है...
        </Text>
      </View>
    );
  }

  if (!selectedData) return null;

  return (
    <>
      <DetailedTithiCard
        tithiDetailed={selectedData.tithiDetailed}
        samvat={selectedData.samvat}
        colors={colors}
      />

      {/* Core Details Grid */}
      <View className="flex-row flex-wrap justify-between mb-8">
        <InfoCard {...coreCards[0]} colors={colors} />
        <InfoCard {...coreCards[1]} colors={colors} />
        <InfoCard {...coreCards[2]} colors={colors} />
        <InfoCard {...coreCards[3]} colors={colors} />
      </View>

      {/* Muhurat Section */}
      <Text className="text-[16px] font-pbold mb-4 px-2" style={{ color: colors.text }}>
        महत्वपूर्ण समय
      </Text>

      <View
        className="rounded-[28px] p-6 mb-8 border"
        style={[
          styles.premiumCard,
          { backgroundColor: colors.cardBg, borderColor: 'rgba(255,153,51,0.1)' }
        ]}
      >
        <View className="flex-row items-center border-b pb-5 mb-5" style={{ borderBottomColor: colors.border + '30' }}>
          <View className="w-12 h-12 rounded-2xl items-center justify-center bg-green-50 mr-4">
            <Sparkles size={22} color="#10b981" />
          </View>
          <View className="flex-1">
            <Text className="text-[10px] font-pbold uppercase tracking-wider mb-1" style={{ color: '#10b981' }}>
              शुभ मुहूर्त (अभिजित)
            </Text>
            <Text className="text-[16px] font-pbold" style={{ color: colors.text }}>
              {selectedData.shubh_muhurat}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-2xl items-center justify-center bg-red-50 mr-4">
            <Clock size={22} color="#ef4444" />
          </View>
          <View className="flex-1">
            <Text className="text-[10px] font-pbold uppercase tracking-wider mb-1" style={{ color: '#ef4444' }}>
              राहुकाल
            </Text>
            <Text className="text-[16px] font-pbold" style={{ color: colors.text }}>
              {selectedData.rahukal}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
});
