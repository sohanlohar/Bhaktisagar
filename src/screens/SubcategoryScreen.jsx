import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import ItemCard from '../components/ItemCard';

import mantras from '../data/mantras.json';
import chalisas from '../data/chalisas.json';
import bhajans from '../data/bhajans.json';
import aartis from '../data/aartis.json';

export default function SubcategoryScreen() {
  const nav = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();
  const { subId, kind, title } = route.params;

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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View className="px-5 pt-6 pb-4">
        <Text className="text-3xl font-bold" style={{ color: colors.text }}>{title}</Text>
        <Text className="text-[14px] mt-1" style={{ color: colors.textLight }}>सूची</Text>
      </View>

      {filtered.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text style={{ color: colors.textLight }}>कोई सामग्री उपलब्ध नहीं है।</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <ItemCard
              id={item.id}
              title={item.title}
              onPress={() => nav.navigate('Detail', { item: { ...item, kind } })}
            />
          )}
        />
      )}
    </View>
  );
}
