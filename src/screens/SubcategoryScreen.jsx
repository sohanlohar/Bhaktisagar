import React from 'react';
import { View, FlatList, Text, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import mantras from '../data/mantras.json';
import chalisas from '../data/chalisas.json';
import bhajans from '../data/bhajans.json';
import aartis from '../data/aartis.json';

export default function SubcategoryScreen() {
  const nav = useNavigation();
  const route = useRoute();
  const { subId, kind } = route.params; // e.g. { subId: 'hanuman', kind: 'mantra' }

  const allData = {
    mantra: mantras,
    chalisa: chalisas,
    bhajan: bhajans,
    aarti: aartis,
  };

  const filtered =
    allData[kind]?.filter(
      (item) =>
        item.subCategory &&
        item.subCategory.toLowerCase() === subId.toLowerCase()
    ) || [];

  return (
    <View className="flex-1 p-2">
      {filtered.length === 0 ? (
        <Text className="text-center text-muted mt-10">
          कोई सामग्री उपलब्ध नहीं है।
        </Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => nav.navigate('DetailList', { item })}
              className="bg-white border border-gray-200 rounded-xl p-4 mb-3"
            >
              <Text className="text-[14px] text-text">{item.title}</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
