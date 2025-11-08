import React from 'react';
import { Pressable, Text } from 'react-native';

export default function CategoryPill({ label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className="px-4 py-2 rounded-full bg-white border border-gray-200 mr-2 shadow-sm"
    >
      <Text className="text-[13px] text-text" >{label}</Text>
    </Pressable>
  );
}
