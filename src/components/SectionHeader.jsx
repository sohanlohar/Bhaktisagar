import React from 'react';
import { View, Text, Pressable } from 'react-native';

export default function SectionHeader({ title, onSeeAll }) {
  return (
    <View className="px-4 mt-5 mb-2 flex-row items-center justify-between">
      <Text className="text-lg font-semibold text-text">{title}</Text>
      {onSeeAll && (
        <Pressable onPress={onSeeAll}>
          <Text className="text-primary">और देखें ›</Text>
        </Pressable>
      )}
    </View>
  );
}
