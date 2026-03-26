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

  // Resolve full content by id once, so opening the tab is fast.
  const resolvedBookmarks = useMemo(() => {
    return bookmarks.map((b) => {
      const resolved = resolveContentById(b.id);
      if (resolved) return resolved;
      return { id: b.id, title: b.title, kind: b.kind };
    });
  }, [bookmarks]);

  return (
    <ScreenWrapper>

      <View style={{ flex: 1, backgroundColor: colors.background }}>

        <BhaktiHeader />

        <View style={{ flex: 1, padding: 16 }}>

          <Text
            className="text-2xl font-bold mb-6"
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
            ListEmptyComponent={
              <Text
                style={{ color: colors.textLight, textAlign: 'center', marginTop: 60 }}
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