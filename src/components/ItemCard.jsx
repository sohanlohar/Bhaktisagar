import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { Heart } from 'lucide-react-native';
import { useBookmarks } from '../hooks/useBookmarks';
import { useTheme } from '../context/ThemeContext';
import AnimatedPressable from './AnimatedPressable';

const ItemCard = React.memo(({ id, title, onPress, item }) => {
  const { toggle, isBookmarked } = useBookmarks();
  const { colors } = useTheme();
  const active = isBookmarked(id);

  const handleBookmarkPress = (e) => {
    // Some RN versions may call onPress without an event argument.
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }

    // Preserve kind when possible, but keep a safe fallback.
    const bookmarkItem = item || { id, title, kind: 'bhajan' };
    toggle(bookmarkItem);
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      className="rounded-[16px] shadow-md p-5"
      style={{
        backgroundColor: colors.cardBg,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 10,
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text
            className="text-[14px] font-bold"
            style={{ color: colors.text }}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
        <Pressable onPress={handleBookmarkPress}>
          <Heart
            size={20}
            color={active ? colors.saffron : colors.textLight}
            fill={active ? colors.saffron : 'none'}
          />
        </Pressable>
      </View>
    </AnimatedPressable>
  );
});

export default ItemCard;