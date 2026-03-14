import React from 'react';
import { View, Text, FlatList } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useBookmarks } from '../hooks/useBookmarks';
import { useTheme } from '../context/ThemeContext';
import ItemCard from '../components/ItemCard';
import { useNavigation } from '@react-navigation/native';
import { BhaktiHeader } from '../components/home/BhaktiHeader';
import BhaktiLoader from '../components/BhaktiLoader';

const BookmarksScreen = () => {
  const { bookmarks } = useBookmarks();
  const { colors } = useTheme();
  const nav = useNavigation();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <ScreenWrapper>
        <BhaktiHeader />
        <BhaktiLoader message="पसंदीदा सामग्री लोड हो रही है..." />
      </ScreenWrapper>
    );
  }
  return (
    <ScreenWrapper>
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
                <Text
                  className="text-center px-6"
                  style={{ color: colors.textLight }}
                >
                  अभी कोई बुकमार्क नहीं है। अपने प्रिय मंत्र, चालीसा और आरती को
                  बुकमार्क करके यहां देखें।
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default BookmarksScreen;
