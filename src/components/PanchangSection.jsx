import React, { memo, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { ROUTES } from '../constants';

import {
  Sun,
  Wind,
  Clock,
  Sparkles,
  Sunrise,
  Sunset,
  ChevronRight,
  Zap,
} from 'lucide-react-native';

const GridItem = ({ icon: Icon, label, value, color, colors }) => (
  <View 
    className="flex-1 p-3 rounded-2xl border" 
    style={{ 
        backgroundColor: colors.cardBg, 
        borderColor: colors.border + '30',
        minHeight: 80 
    }}
  >
    <View className="flex-row items-center gap-2 mb-2">
      <Icon size={14} color={color} />
      <Text className="text-[10px] font-pbold uppercase tracking-wider" style={{ color: colors.textLight }}>
        {label}
      </Text>
    </View>
    <Text className="text-[13px] font-pbold" style={{ color: colors.text }} numberOfLines={1}>
      {value}
    </Text>
  </View>
);

function PanchangSection({ panchang }) {
  const { colors, isDarkMode } = useTheme();
  const navigation = useNavigation();

  const openPanchang = useCallback(() => {
    navigation.navigate(ROUTES.ROOT_TABS, { screen: ROUTES.PANCHANG });
  }, [navigation]);

  if (!panchang) return null;

  return (
    <View className="px-5 mt-4">
      <Pressable
        onPress={openPanchang}
        style={[styles.cardContainer, { backgroundColor: colors.cardBg }]}
        className="rounded-[32px] overflow-hidden border shadow-xl"
      >
        {/* Background Subtle Gradient */}
        <View style={StyleSheet.absoluteFill}>
          <Svg height="100%" width="100%">
            <Defs>
              <LinearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={colors.saffron} stopOpacity={isDarkMode ? 0.1 : 0.08} />
                <Stop offset="50%" stopColor="#FFFFFF" stopOpacity="0" />
                <Stop offset="100%" stopColor={colors.orange} stopOpacity={isDarkMode ? 0.05 : 0.03} />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#cardGrad)" />
          </Svg>
        </View>

        <View className="p-6">
          {/* Main Tithi Header */}
          <View className="flex-row justify-between items-start mb-6">
            <View className="flex-1">
              <Text className="text-[22px] font-pbold leading-tight" style={{ color: colors.text }}>
                {panchang.tithi}
              </Text>
              <View className="flex-row items-center mt-1">
                <View className="h-1.5 w-1.5 rounded-full mr-2" style={{ backgroundColor: colors.saffron }} />
                <Text className="text-[12px] font-psemibold" style={{ color: colors.saffron }}>
                  {panchang.dayName}वार • {panchang.masa} मास
                </Text>
              </View>
            </View>
            <View 
              className="px-3 py-1.5 rounded-full border flex-row items-center gap-1.5"
              style={{ borderColor: colors.saffron + '30', backgroundColor: colors.saffron + '10' }}
            >
              <Clock size={12} color={colors.saffron} />
              <Text className="text-[11px] font-pbold" style={{ color: colors.text }}>
                {panchang.date.split(' ')[0]} {panchang.date.split(' ')[1]}
              </Text>
            </View>
          </View>

          {/* Sunrise/Sunset Sub-header */}
          <View className="flex-row items-center gap-6 mb-6 px-1">
            <View className="flex-row items-center gap-2">
              <View className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <Sunrise size={16} color={colors.orange} />
              </View>
              <View>
                <Text className="text-[9px] font-pbold uppercase text-gray-400">सूर्योदय</Text>
                <Text className="text-[12px] font-pbold" style={{ color: colors.text }}>{panchang.sunrise}</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Sunset size={16} color="#3B82F6" />
              </View>
              <View>
                <Text className="text-[9px] font-pbold uppercase text-gray-400">सूर्यास्त</Text>
                <Text className="text-[12px] font-pbold" style={{ color: colors.text }}>{panchang.sunset}</Text>
              </View>
            </View>
          </View>

          {/* Enriched Data Grid */}
          <View className="flex-row gap-3 mb-6">
            <GridItem icon={Wind} label="नक्षत्र" value={panchang.nakshatra} color="#8B5CF6" colors={colors} />
            <GridItem icon={Zap} label="योग" value={panchang.yoga} color="#10B981" colors={colors} />
          </View>
          
          <View className="flex-row gap-3 mb-6">
            <GridItem 
              icon={Clock} 
              label="राहुकाल" 
              value={panchang.rahukal} 
              color={colors.pillRed} 
              colors={colors} 
            />
            <GridItem 
              icon={Sparkles} 
              label="शुभ मुहूर्त" 
              value={panchang.shubh_muhurat} 
              color={colors.pillGreen} 
              colors={colors} 
            />
          </View>

          {/* Footer Navigation */}
          <View className="flex-row justify-between items-center pt-4 border-t" style={{ borderTopColor: colors.border + '20' }}>
            <Text className="text-[12px] font-pmedium italic" style={{ color: colors.textLight }}>
              विक्रम संवत: {panchang.samvat.vikram}
            </Text>
            <View className="flex-row items-center gap-1">
              <Text className="text-[12px] font-pbold" style={{ color: colors.saffron }}>विस्तृत विवरण</Text>
              <ChevronRight size={16} color={colors.saffron} />
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderColor: 'rgba(255,153,51,0.15)',
    shadowColor: '#FF9933',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
});

export default memo(PanchangSection);
