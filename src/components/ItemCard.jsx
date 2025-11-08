import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useBookmarks } from '../context/BookmarkContext';
import { Home, Bookmark, CalendarDays, CloudSun } from 'lucide-react-native';

export default function ItemCard({ id, title, onPress }) {
  const { isBookmarked, toggle } = useBookmarks();
  const active = isBookmarked(id);
  return (
    <Pressable
      onPress={onPress}
      className="bg-white border border-gray-200 rounded-xl p-3 m-2 flex-1 shadow-sm"
    >
      <View className="flex-row items-center justify-between">
        <Text className="flex-1 text-[13px] text-text" numberOfLines={1}>
          {title}
        </Text>
        <Pressable
          onPress={() => toggle({ id, title, kind: 'bhajan' })}
          hitSlop={10}
        >
          <Bookmark 
            name={active ? 'bookmark' : 'bookmark-outline'}
            color={active ? '#B22222' : '#777'}
            size={18}
          />
        </Pressable>
      </View>
    </Pressable>
  );
}
