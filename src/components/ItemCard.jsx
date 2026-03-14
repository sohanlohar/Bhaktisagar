import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { Heart } from 'lucide-react-native';
import { useBookmarks } from '../hooks/useBookmarks';
import { useTheme } from '../context/ThemeContext';
import AnimatedPressable from './AnimatedPressable';

export default function ItemCard({ id, title, onPress }) {

  const { toggle, isBookmarked } = useBookmarks();
  const { colors } = useTheme();

  const active = isBookmarked(id);

  const handleBookmarkPress = (e) => {
    e.stopPropagation();
    toggle({ id, title });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      className="rounded-[16px] p-5 shadow-md"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.border,
        borderWidth: 1,
        marginBottom: 10,
      }}
    >
      <View className="flex-row items-center justify-between">

        <Text
          className="text-[14px] font-bold"
          style={{ color: colors.text }}
        >
          {title}
        </Text>

        <Pressable onPress={handleBookmarkPress}>
          <Heart
            size={20}
            color={active ? colors.saffron : colors.textLight}
            fill={active ? colors.saffron : "none"}
          />
        </Pressable>

      </View>
    </AnimatedPressable>
  );
}