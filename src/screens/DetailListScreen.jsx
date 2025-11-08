import React from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useBookmarks } from '../context/BookmarkContext';
import { Home, Bookmark, CalendarDays, CloudSun } from 'lucide-react-native';

export default function DetailListScreen() {
  const { params } = useRoute();
  const { item } = params; // full JSON object
  const { toggle, isBookmarked } = useBookmarks();

  const bookmarked = isBookmarked(item.id);

  return (
    <ScrollView className="flex-1 p-4">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-xl font-semibold text-text">{item.title}</Text>
        <Pressable onPress={() => toggle(item)}>
          <Bookmark
            name={bookmarked ? 'bookmark' : 'bookmark-outline'}
            color={bookmarked ? '#B22222' : '#777'}
            size={18}
          />
        </Pressable>
      </View>

      <Text className="text-[15px] leading-7 text-text">
        {item.content || 'सामग्री शीघ्र ही उपलब्ध होगी।'}
      </Text>
    </ScrollView>
  );
}
