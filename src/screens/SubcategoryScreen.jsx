import React, { useMemo, useCallback } from 'react';
import { View, FlatList, Text, Pressable } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { ChevronLeft } from 'lucide-react-native';
import ItemCard from '../components/ItemCard';

import mantras from '../data/mantras.json';
import chalisas from '../data/chalisas.json';
import bhajans from '../data/bhajans.json';
import aartis from '../data/aartis.json';

const DATA_MAP = {
  mantra: mantras,
  chalisa: chalisas,
  bhajan: bhajans,
  aarti: aartis,
};

export default function SubcategoryScreen() {

  const nav = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();

  const { subId, kind, title } = route.params;

  /* ---------- Filter Data ---------- */

  const filtered = useMemo(() => {

    const list = DATA_MAP[kind] || [];

    return list.filter(item =>
      item.subCategory &&
      item.subCategory.toLowerCase() === subId.toLowerCase()
    );

  }, [subId, kind]);

  /* ---------- Navigation ---------- */

  const openDetail = useCallback((item) => {

    nav.navigate('Detail', {
      item: { ...item, kind }
    });

  }, [nav, kind]);

  /* ---------- Render Item ---------- */

  const renderItem = useCallback(({ item }) => (

    <ItemCard
      id={item.id}
      title={item.title}
      item={{ ...item, kind }}
      onPress={() => openDetail(item)}
    />

  ), [openDetail, kind]);

  /* ---------- Empty ---------- */

  const renderEmpty = useMemo(() => (

    <View className="flex-1 items-center justify-center px-6">

      <Text
        className="text-center"
        style={{ color: colors.textLight }}
      >
        इस उपश्रेणी में अभी कोई सामग्री उपलब्ध नहीं है।
      </Text>

    </View>

  ), [colors.textLight]);

  return (

    <ScreenWrapper>

      <View style={{ flex: 1, backgroundColor: colors.background }}>

        {/* Header */}

        <View
          className="flex-row items-center px-5 py-4"
          style={{ backgroundColor: colors.headerBg }}
        >

          <Pressable
            onPress={() => nav.goBack()}
            className="mr-3"
          >

            <ChevronLeft
              color={colors.headerText}
              size={28}
            />

          </Pressable>

          <View>

            <Text
              className="text-3xl font-bold"
              style={{ color: colors.headerText }}
            >
              {title}
            </Text>

            <Text
              className="text-[14px]"
              style={{
                color: colors.headerText,
                opacity: 0.8
              }}
            >
              सूची
            </Text>

          </View>

        </View>

        {/* List */}

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingBottom: 20,
            flexGrow: filtered.length === 0 ? 1 : 0
          }}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews
          showsVerticalScrollIndicator={false}
        />

      </View>

    </ScreenWrapper>

  );
}