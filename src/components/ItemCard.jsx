import React, { useMemo } from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import { Heart, Music, Zap, ScrollText, Sparkles, Star, BookOpenText } from 'lucide-react-native';
import { useBookmarks } from '../hooks/useBookmarks';
import { useTheme } from '../context/ThemeContext';
import AnimatedPressable from './AnimatedPressable';

// const getKindIcon = (kind) => {
//   switch (kind) {
//     case 'mantra': return Sparkles;
//     case 'chalisa': return ScrollText;
//     case 'bhajan': return Music;
//     case 'aarti': return Zap;
//     default: return Star;
//   }
// };

const ItemCard = React.memo(({ id, title, onPress, item }) => {
  const { toggle, isBookmarked } = useBookmarks();
  const { colors } = useTheme();
  const active = isBookmarked(id);
  const kind = item?.kind || 'bhajan';
  // const KindIcon = getKindIcon(kind);

  const handleBookmarkPress = (e) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    const bookmarkItem = item || { id, title, kind };
    toggle(bookmarkItem);
  };

  const cardStyle = useMemo(() => ({
    backgroundColor: colors.cardBg,
    borderColor: colors.border + '40',
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  }), [colors.cardBg, colors.border, colors.orange]);

  return (
    <AnimatedPressable
      onPress={onPress}
      className="rounded-3xl mb-4 p-4 border"
      style={cardStyle}
    >
      <View className="flex-row items-center">
        <View
          className="w-10 h-10 rounded-2xl items-center justify-center mr-3"
          style={{ backgroundColor: colors.orange + '15' }}
        >
          <ScrollText size={20} color={colors.orange} />
        </View>

        <View className="flex-1">
          <Text
            className="text-[15px] font-pbold leading-1"
            style={{ color: colors.text }}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text
            className="text-[10px] font-pmedium uppercase tracking-tighter"
            style={{ color: colors.textLight }}
          >
            {kind}
          </Text>
        </View>

        <Pressable
          onPress={handleBookmarkPress}
          className="p-2 ml-1"
          hitSlop={10}
        >
          <Heart
            size={22}
            color={active ? colors.saffron : colors.textLight + '50'}
            fill={active ? colors.saffron : 'none'}
          />
        </Pressable>
      </View>
    </AnimatedPressable>
  );
});

export default ItemCard;
