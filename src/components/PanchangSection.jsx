import React, { memo, useCallback, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { ROUTES } from '../constants';

import {
  Sun,
  Wind,
  Clock,
  Sparkles,
  Sunrise,
  Sunset,
  Moon,
  Activity,
} from 'lucide-react-native';

function PanchangSection({ panchang }) {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const openPanchang = useCallback(() => {
    const parent = navigation.getParent();

    if (parent) {
      parent.navigate(ROUTES.PANCHANG);
      return;
    }

    navigation.navigate(ROUTES.ROOT_TABS, { screen: ROUTES.PANCHANG });
  }, [navigation]);

  if (!panchang) return null;

  return (
    <View className="px-4">
      <Pressable
        onPress={openPanchang}
        className="rounded-3xl p-5 border"
        style={{
          backgroundColor: colors.cardBg,
          borderColor: colors.border,
          shadowOpacity: 0.1,
          elevation: 2,
        }}
      >
        {/* Header */}

        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center gap-2">
            <Sun size={20} color={colors.saffron} />
            <Text className="text-base font-pbold" style={{ color: colors.text }}>
              {panchang.tithi}
            </Text>
          </View>

          <Text className="text-md font-pmedium" style={{ color: colors.text }}>
            {panchang.dayName}वार - {panchang.date}
          </Text>
        </View>

        {/* Nakshatra */}

        <View className="flex-row items-center gap-2 mb-2">
          <Wind size={16} color={colors.textLight} />
          <Text className="text-md font-pmedium" style={{ color: colors.text }}>
            नक्षत्र: {panchang.nakshatra}
          </Text>
        </View>

        {/* Rahukal */}

        <View className="mb-4">
          <View className="flex-row items-center gap-2 mb-2">
            <Clock size={16} color={colors.pillRed} />
            <Text className="text-md font-pmedium" style={{ color: colors.text }}>
              राहुकाल: {panchang.rahukal}
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <Sparkles size={16} color={colors.saffron} />
            <Text className="text-md font-pmedium" style={{ color: colors.text }}>
              शुभ मुहूर्त: {panchang.shubh_muhurat}
            </Text>
          </View>
        </View>

        {/* Yoga & Karana */}

        <View className="flex-row justify-between mb-4">
          <View className="flex-row items-center gap-2 flex-1">
            <Activity size={16} color={colors.primary} />
            <Text className="text-md font-pmedium" style={{ color: colors.text }}>
              योग: {panchang.yoga}
            </Text>
          </View>

          <View className="flex-row items-center gap-2 flex-1 justify-end">
            <Moon size={16} color={colors.textLight} />
            <Text className="text-md font-pmedium" style={{ color: colors.text }}>
              करण: {panchang.karana}
            </Text>
          </View>
        </View>

        {/* Sunrise Sunset */}

        <View
          className="flex-row justify-between pt-3 border-t"
          style={{
            borderTopColor: colors.border + '55',
          }}
        >
          <View className="flex-row items-center gap-2">
            <Sunrise size={14} color={colors.orange} />

            <Text className="text-xs font-pmedium" style={{ color: colors.textLight }}>
              {panchang.sunrise}
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <Sunset size={14} color={colors.orange} />
            <Text className="text-base font-pbold" style={{ color: colors.textLight }}>
              {panchang.sunset}
            </Text>
          </View>

          <Text className="font-pbold" style={{ color: colors.saffron }}>
            विस्तृत पंचांग ›
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

export default memo(PanchangSection);
