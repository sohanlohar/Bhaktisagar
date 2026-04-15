import React, { useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useTheme } from '../context/ThemeContext';
import ItemCard from '../components/ItemCard';
import { useNavigation } from '@react-navigation/native';
import { BhaktiHeader } from '../components/home/BhaktiHeader';
import { useBookmarks } from '../hooks/useBookmarks';
import { resolveContentById } from '../utils/homeContentUtils';


const BookmarksScreen = () => {

  const { bookmarks } = useBookmarks();
  const { colors } = useTheme();
  const nav = useNavigation();

  const resolvedBookmarks = useMemo(() => {
    return bookmarks.map((b) => {
      const resolved = resolveContentById(b.id);
      if (resolved) return resolved;
      return { id: b.id, title: b.title, kind: b.kind };
    });
  }, [bookmarks]);

  return (
    <ScreenWrapper>
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        <BhaktiHeader />

        <View className="flex-1 p-4">
          <Text
            className="mb-6 font-pbold text-[24px] leading-[32px]"
            style={{ color: colors.text }}
          >
            मेरे बुकमार्क
          </Text>

          <FlatList
            data={resolvedBookmarks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ItemCard
                id={item.id}
                title={item.title}
                item={item}
                onPress={() => nav.navigate('Detail', { item })}
              />
            )}
            initialNumToRender={8}
            maxToRenderPerBatch={10}
            windowSize={10}
            removeClippedSubviews
            ListEmptyComponent={
              <Text
                className="text-center font-pmedium text-[16px] leading-[26px]"
                style={{ color: colors.textLight, marginTop: 60 }}
              >
                अभी कोई बुकमार्क नहीं है।
              </Text>
            }
          />

        </View>

      </View>

    </ScreenWrapper>
  );
};

export default BookmarksScreen;
