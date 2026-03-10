import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { useBookmarks } from '../hooks/useBookmarks';
import { Bookmark } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import AnimatedPressable from './AnimatedPressable';

export default function ItemCard({ id, title, onPress, item }) {
  const { isBookmarked, toggle } = useBookmarks();
  const { colors } = useTheme();
  const active = isBookmarked(id);

  const handleBookmarkPress = (e) => {
    e.stopPropagation();
    // Use full item if provided, otherwise create minimal object
    const bookmarkItem = item || { id, title, kind: 'bhajan' };
    toggle(bookmarkItem);
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      className="rounded-[16px] p-5 shadow-md"
      style={{
        minHeight: 80,
        backgroundColor: colors.cardBg,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
        borderWidth: 1,
        borderColor: colors.border
      }}
    >
      <View className="flex-row items-center justify-between flex-wrap">
        <View className="flex-1">
          <Text className="text-[14px] font-bold mb-1" style={{ color: colors.text }} numberOfLines={1}>
            {title}
          </Text>
        </View>
        <Pressable
          onPress={handleBookmarkPress}
          hitSlop={20}
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.background }}
        >
          <Bookmark
            fill={active ? colors.saffron : 'transparent'}
            color={active ? colors.saffron : colors.textLight}
            size={18}
            strokeWidth={2}
          />
        </Pressable>
      </View>
    </AnimatedPressable>
  );
}
