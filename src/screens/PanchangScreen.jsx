import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import {
  getNext7DaysPanchang,
  getTodayPanchang,
} from '../services/panchangApi';
import { useTheme } from '../context/ThemeContext';
import { Calendar, Moon, Sun } from 'lucide-react-native';
import { BhaktiHeader } from '../components/home/BhaktiHeader';

export default function PanchangScreen() {
  const [today, setToday] = useState(null);
  const [week, setWeek] = useState([]);
  const { colors, isDarkMode } = useTheme();

  useEffect(() => {
    (async () => {
      setToday(await getTodayPanchang());
      setWeek(await getNext7DaysPanchang());
    })();
  }, []);

  const InfoRow = ({ label, value, icon: Icon }) => (
    <View className="flex-row items-center justify-between py-3 border-b" style={{ borderBottomColor: colors.border }}>
      <View className="flex-row items-center">
        {Icon && <Icon size={18} color={colors.saffron} className="mr-3" />}
        <Text style={{ color: colors.textLight, fontSize: 14 }}>{label}</Text>
      </View>
      <Text style={{ color: colors.text, fontSize: 15, fontWeight: 'bold' }}>{value}</Text>
    </View>
  );

  return (
    <ScreenWrapper>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <BhaktiHeader />
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View className="p-5">
            <Text className="text-2xl font-bold mb-6" style={{ color: colors.text }}>पंचांग</Text>

            {today && (
              <>
                <View
                  className="rounded-[32px] p-6 mb-8 shadow-sm border"
                  style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
                >
                  <View className="flex-row items-center justify-between mb-6">
                    <View>
                      <Text className="text-[14px] uppercase tracking-wider mb-1" style={{ color: colors.textLight }}>आज की तिथि</Text>
                      <Text className="text-[20px] font-bold" style={{ color: colors.text }}>{today.date}</Text>
                    </View>
                    <View className="w-12 h-12 rounded-2xl items-center justify-center" style={{ backgroundColor: colors.saffron + '22' }}>
                      <Calendar color={colors.saffron} size={24} />
                    </View>
                  </View>

                  <InfoRow label="तिथि" value={today.tithi} icon={Moon} />
                  <InfoRow label="नक्षत्र" value={today.nakshatra} icon={Sun} />
                  <InfoRow label="योग" value={today.yoga} />
                  <InfoRow label="करण" value={today.karana} />
                </View>

                <Text className="text-xl font-bold mb-4" style={{ color: colors.text }}>आगामी तिथियां</Text>
                {week.map((item, idx) => (
                  <View
                    key={idx}
                    className="flex-row items-center justify-between p-4 mb-3 rounded-2xl border"
                    style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
                  >
                    <View>
                      <Text style={{ color: colors.text, fontWeight: 'bold' }}>{item.date}</Text>
                      <Text style={{ color: colors.textLight, fontSize: 12 }}>तिथि: {item.tithi}</Text>
                    </View>
                    <View className="w-8 h-8 rounded-lg items-center justify-center" style={{ backgroundColor: colors.background }}>
                      <Calendar size={16} color={colors.textLight} />
                    </View>
                  </View>
                ))}
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}
