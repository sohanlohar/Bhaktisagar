import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useBookmarks } from '../context/BookmarkContext';

const BookmarksScreen = () => {
  const { bookmarks } = useBookmarks();

  return (
    <View className="flex-1 p-4">
      <Text className="text-xl font-semibold mb-3">बुकमार्क</Text>
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-white border border-gray-200 rounded-xl p-3 mb-2">
            <Text className="text-[14px] text-text">{item.title}</Text>
            <Text className="text-[12px] text-muted mt-1">{item.kind}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-muted">अभी कोई बुकमार्क नहीं।</Text>
        }
      />
    </View>
  );
};

export default BookmarksScreen;
