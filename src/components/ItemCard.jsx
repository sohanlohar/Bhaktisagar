import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { useBookmarks } from '../hooks/useBookmarks';
import { Bookmark } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import AnimatedPressable from './AnimatedPressable';

export default function ItemCard({ id, title, onPress }) {
  const { isBookmarked, toggle } = useBookmarks();
  const { colors } = useTheme();
  const active = isBookmarked(id);

  return (
    <AnimatedPressable
      onPress={onPress}
      className="rounded-[24px] p-5 m-2 flex-1 shadow-md"
      style={{
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
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-[16px] font-bold mb-1" style={{ color: colors.text }} numberOfLines={1}>
            {title}
          </Text>
          <Text className="text-[12px]" style={{ color: colors.textLight }}>सुप्रभात • २ मि</Text>
        </View>
        <Pressable
          onPress={() => toggle({ id, title, kind: 'bhajan' })}
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
