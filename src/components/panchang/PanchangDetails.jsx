import React, { memo, useMemo } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
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
      className="rounded-3xl p-5 mb-8 shadow-sm border"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.border,
      }}
    >
      <View className="flex-row items-center gap-4 mb-3">
        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.primary + '15' }}
        >
          <Moon size={20} color={colors.primary} />
        </View>
        <Text
          className="text-md font-pbold uppercase tracking-widest"
          style={{ color: colors.primary }}
        >
          विस्तृत तिथि विवरण
        </Text>
      </View>

      <Text
        className="text-base leading-7 font-psemibold"
        style={{ color: colors.text }}
      >
        {tithiDetailed}
      </Text>

      {/* Samvat Info */}
      <View
        className="mt-4 pt-4 border-t flex-row flex-wrap gap-y-2 justify-between"
        style={{ borderTopColor: colors.border + '50' }}
      >
        <View className="mr-6">
          <Text
            className="text-md uppercase font-pbold mb-1"
            style={{ color: colors.primary }}
          >
            विक्रम संवत
          </Text>
          <Text className="text-md font-pbold" style={{ color: colors.text }}>
            {samvat?.vikram || '--'}
          </Text>
        </View>

        <View className="mr-6">
          <Text
            className="text-md uppercase font-pbold mb-1"
            style={{ color: colors.primary }}
          >
            शक संवत
          </Text>
          <Text className="text-md font-pbold" style={{ color: colors.text }}>
            {samvat?.shaka || '--'}
          </Text>
        </View>

        <View>
          <Text
            className="text-md uppercase font-pbold mb-1"
            style={{ color: colors.primary }}
          >
            संवत्सर
          </Text>
          <Text className="text-md font-pbold" style={{ color: colors.text }}>
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
  /* ---------- Memo Data ---------- */

  const coreCards = useMemo(() => {
    if (!selectedData) return [];

    return [
      {
        icon: Moon,
        label: 'तिथि',
        value: selectedData.tithi,
        color: colors.orange,
      },
      {
        icon: Sun,
        label: 'नक्षत्र',
        value: selectedData.nakshatra,
        color: colors.primary,
      },
      {
        icon: Activity,
        label: 'योग',
        value: selectedData.yoga,
        color: colors.pillGreen,
      },
      {
        icon: Wind,
        label: 'करण',
        value: selectedData.karana,
        color: colors.textLight,
      },
    ];
  }, [selectedData, colors]);

  /* ---------- Loading ---------- */

  if (detailLoading) {
    return (
      <View className="py-20 items-center justify-center">
        <ActivityIndicator size="large" color={colors.saffron} />
        <Text className="mt-4 text-sm" style={{ color: colors.textLight }}>
          विवरण लोड हो रहा है...
        </Text>
      </View>
    );
  }

  if (!selectedData) return null;

  /* ---------- UI ---------- */

  return (
    <>
      {/* Detailed Tithi Card */}
      <DetailedTithiCard
        tithiDetailed={selectedData.tithiDetailed}
        samvat={selectedData.samvat}
        colors={colors}
      />

      {/* Core Section */}

      <Text
        className="text-lg font-pbold mb-4 px-1"
        style={{ color: colors.text }}
      >
        मुख्य विवरण
      </Text>

      <View className="flex-row justify-between mb-2">
        <InfoCard {...coreCards[0]} colors={colors} />
        <InfoCard {...coreCards[1]} colors={colors} />
      </View>

      <View className="flex-row justify-between mb-8">
        <InfoCard {...coreCards[2]} colors={colors} />
        <InfoCard {...coreCards[3]} colors={colors} />
      </View>

      {/* Muhurat */}

      <Text
        className="text-lg font-pbold mb-4 px-1"
        style={{ color: colors.text }}
      >
        महत्वपूर्ण समय
      </Text>

      <View
        className="rounded-3xl p-6 mb-8 shadow-sm border"
        style={{
          backgroundColor: colors.cardBg,
          borderColor: colors.border,
        }}
      >
        <View
          className="flex-row items-center justify-between mb-5 border-b pb-5"
          style={{ borderBottomColor: colors.border + '50' }}
        >
          <View className="flex-row items-center gap-4">
            <View className="w-12 h-12 rounded-2xl items-center justify-center bg-orange-100">
              <Sparkles size={20} color="#f97316" />
            </View>

            <View>
              <Text
                className="text-xs font-pbold uppercase tracking-wider mb-1"
                style={{ color: colors.textLight }}
              >
                शुभ मुहूर्त (अभिजित)
              </Text>

              <Text
                className="text-base font-pbold"
                style={{ color: colors.text }}
              >
                {selectedData.shubh_muhurat}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center gap-4">
          <View className="w-12 h-12 rounded-2xl items-center justify-center bg-red-100">
            <Clock size={20} color="#ef4444" />
          </View>

          <View>
            <Text className="text-xs font-pbold uppercase text-red-500 mb-1">
              राहुकाल
            </Text>

            <Text
              className="text-base font-pbold"
              style={{ color: colors.text }}
            >
              {selectedData.rahukal}
            </Text>
          </View>
        </View>
      </View>

      {/* Sun & Moon */}

      <Text
        className="text-lg font-pbold mb-4 px-1"
        style={{ color: colors.text }}
      >
        सूर्य और चंद्र
      </Text>

      <View className="flex-row justify-between mb-4">
        <View
          className="flex-1 rounded-3xl p-4 border m-1 flex-row items-center shadow-sm"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.border,
          }}
        >
          <View
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: colors.orange + '15' }}
          >
            <Sunrise size={20} color={colors.orange} />
          </View>

          <View>
            <Text
              className="text-[10px] uppercase font-pbold"
              style={{ color: colors.textLight }}
            >
              सूर्योदय
            </Text>

            <Text className="text-sm font-pbold" style={{ color: colors.text }}>
              {selectedData.sunrise}
            </Text>
          </View>
        </View>

        <View
          className="flex-1 rounded-3xl p-4 border m-1 flex-row items-center shadow-sm"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.border,
          }}
        >
          <View
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: colors.orange + '15' }}
          >
            <Sunset size={20} color={colors.orange} />
          </View>

          <View>
            <Text
              className="text-[10px] uppercase font-pbold"
              style={{ color: colors.textLight }}
            >
              सूर्यास्त
            </Text>

            <Text className="text-sm font-pbold" style={{ color: colors.text }}>
              {selectedData.sunset}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
});
