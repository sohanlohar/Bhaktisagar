import React from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useBookmarks } from '../hooks/useBookmarks';
import { Bookmark, ChevronLeft } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

export default function DetailListScreen() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const { toggle, isBookmarked } = useBookmarks();

  // Handle both { item } and { title, items } formats for robustness
  const item = params?.item;
  const title = params?.title || item?.title || 'Bhakti';
  const content = item?.content || item?.lyrics || 'सामग्री शीघ्र ही उपलब्ध होगी।';

  const bookmarked = item ? isBookmarked(item.id) : false;

  return (
    <ScreenWrapper>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-4 border-b" style={{ backgroundColor: colors.headerBg, borderBottomColor: colors.border }}>
          <Pressable onPress={() => navigation.goBack()} className="p-2">
            <ChevronLeft color={colors.text} size={28} />
          </Pressable>
          <Text className="text-xl font-bold flex-1 ml-4" style={{ color: colors.text }} numberOfLines={1}>{title}</Text>
          {item && (
            <Pressable onPress={() => toggle({ ...item, timestamp: Date.now() })} className="p-2">
              <Bookmark
                color={bookmarked ? colors.saffron : colors.text}
                fill={bookmarked ? colors.saffron : 'none'}
                size={24}
              />
            </Pressable>
          )}
        </View>

        <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
          <Text style={{ fontSize: 18, lineHeight: 32, color: colors.text, textAlign: 'center' }}>
            {content}
          </Text>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}
