import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ChevronLeft, BookOpenText } from 'lucide-react-native';

import ScreenWrapper from '../components/ScreenWrapper';
import { useTheme } from '../context/ThemeContext';
import { getDailyGitaGyan } from '../utils/gitaGyanUtils';

export default function GitaGyanScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [dailyGyan, setDailyGyan] = useState(() => getDailyGitaGyan());

  useFocusEffect(
    useCallback(() => {
      setDailyGyan(getDailyGitaGyan());
    }, []),
  );

  return (
    <ScreenWrapper>
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        <View className="flex-row items-center px-5 pb-4 pt-2">
          <Pressable
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="वापस जाएँ"
            className="mr-3 h-11 w-11 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.cardBg }}
          >
            <ChevronLeft size={24} color={colors.text} />
          </Pressable>
          <Text className="text-2xl font-pbold" style={{ color: colors.text }}>
            गीता ज्ञान
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 36 }}
          showsVerticalScrollIndicator={false}
        >
          <View
            className="mb-5 items-center rounded-3xl border p-6"
            style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
          >
            <View
              className="mb-4 h-14 w-14 items-center justify-center rounded-2xl"
              style={{ backgroundColor: colors.saffron + '20' }}
            >
              <BookOpenText size={28} color={colors.orange} />
            </View>
            <Text
              className="mb-2 text-xs font-pbold uppercase"
              style={{ color: colors.orange }}
            >
              आज का श्लोक
            </Text>
            <Text className="mb-2 text-center text-lg font-pbold" style={{ color: colors.text }}>
              {dailyGyan.theme}
            </Text>
            <Text className="text-center text-sm font-pmedium" style={{ color: colors.textLight }}>
              भगवद्गीता, अध्याय {dailyGyan.chapter}, श्लोक {dailyGyan.verse}
            </Text>
            <View className="my-5 h-px w-full" style={{ backgroundColor: colors.border }} />
            <Text
              className="text-center text-xl font-pmedium"
              style={{ color: colors.text, lineHeight: 38 }}
            >
              {dailyGyan.shloka}
            </Text>
          </View>

          <View
            className="rounded-3xl border p-5"
            style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
          >
            <Text className="mb-3 text-lg font-pbold" style={{ color: colors.orange }}>
              सरल भावार्थ
            </Text>
            <Text className="text-base font-pmedium" style={{ color: colors.text, lineHeight: 30 }}>
              {dailyGyan.meaning}
            </Text>
          </View>

          <Text className="mt-4 px-2 text-center text-xs font-pmedium" style={{ color: colors.textLight }}>
            भावार्थ सरल समझ के लिए लिखा गया है; यह शब्दशः अनुवाद नहीं है।
          </Text>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}
