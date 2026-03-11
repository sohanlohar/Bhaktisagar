import React from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { ChevronRight } from 'lucide-react-native';

const SUBS = [
  { id: 'hanuman', title: 'हनुमान', icon: '🙏' },
  { id: 'shiv', title: 'शिव', icon: '🕉️' },
  { id: 'krishna', title: 'कृष्ण', icon: '🪈' },
  { id: 'durga', title: 'दुर्गा', icon: '🔱' },
];

export default function CategoryScreen() {
  const nav = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();
  const { kind, title } = route.params;

  return (
    <ScreenWrapper>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View className="px-5 py-4" style={{ backgroundColor: colors.headerBg }}>
          <Text className="text-3xl font-bold" style={{ color: colors.headerText }}>{title}</Text>
          <Text className="text-[14px] mt-1" style={{ color: colors.headerText, opacity: 0.8 }}>वर्ग चुनें</Text>
        </View>
        <FlatList
          data={SUBS}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                nav.navigate('Subcategory', {
                  kind,
                  subId: item.id,
                  title: `${item.title} ${title}`,
                })
              }
              className="flex-1 m-2 p-6 rounded-[32px] border items-center shadow-sm"
              style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
            >
              <View className="w-16 h-16 rounded-2xl bg-saffron/10 items-center justify-center mb-4" style={{ backgroundColor: colors.saffron + '15' }}>
                <Text className="text-3xl">{item.icon}</Text>
              </View>
              <Text className="text-[16px] font-bold text-center" style={{ color: colors.text }}>{item.title}</Text>
            </Pressable>
          )}
        />
      </View>
    </ScreenWrapper>
  );
}
