import React from 'react';
import { Pressable, Text, View } from 'react-native';

export function IconTile({ icon, label, onPress }) {
  return (
    <Pressable onPress={onPress} className="items-center w-20 mx-2">
      <View className="w-16 h-16 rounded-full bg-white border border-gray-200 items-center justify-center shadow">
        <Text className="text-xl">{icon}</Text>
      </View>
      <Text
        numberOfLines={1}
        className="mt-1 text-[12px] text-center text-text"
      >
        {label}
      </Text>
    </Pressable>
  );
}
