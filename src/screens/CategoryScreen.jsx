import React from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const SUBS = [
  { id: 'hanuman', title: 'हनुमान' },
  { id: 'shiv', title: 'शिव' },
  { id: 'krishna', title: 'कृष्ण' },
  { id: 'durga', title: 'दुर्गा' },
];

export default function CategoryScreen() {
  const nav = useNavigation();
  const route = useRoute();
  const { kind, title } = route.params;

  return (
    <View className="flex-1 p-3">
      <FlatList
        data={SUBS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 8 }}
        contentContainerStyle={{ gap: 8 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              nav.navigate('Subcategory', {
                kind,
                subId: item.id,
                title: `${item.title} ${title}`,
              })
            }
            className="flex-1 bg-white border border-gray-200 rounded-xl p-4"
          >
            <Text className="text-[14px] text-text">{item.title}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
