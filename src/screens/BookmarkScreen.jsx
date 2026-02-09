import React from 'react';
import { View, Text, FlatList, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBookmarks } from '../hooks/useBookmarks';
import { useTheme } from '../context/ThemeContext';
import ItemCard from '../components/ItemCard';
import { useNavigation } from '@react-navigation/native';
import { BhaktiHeader } from '../components/home/BhaktiHeader';

const BookmarksScreen = () => {
  const { bookmarks } = useBookmarks();
  const { colors } = useTheme();
  const nav = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.gold || '#FDCB02' }} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.gold || '#FDCB02'} />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <BhaktiHeader />
        <View style={{ flex: 1, padding: 16 }}>
          <Text className="text-2xl font-bold mb-6" style={{ color: colors.text }}>मेरे बुकमार्क</Text>
          <FlatList
            data={bookmarks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ItemCard
                id={item.id}
                title={item.title}
                onPress={() => nav.navigate('Detail', { item })}
              />
            )}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center mt-20">
                <Text style={{ color: colors.textLight }}>अभी कोई बुकमार्क नहीं है।</Text>
              </View>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BookmarksScreen;
