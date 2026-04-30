import React, { useMemo, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { Heart, ChevronLeft } from 'lucide-react-native';

import ScreenWrapper from '../components/ScreenWrapper';
import { useTheme } from '../context/ThemeContext';
import ItemCard from '../components/ItemCard';
import { useBookmarks } from '../hooks/useBookmarks';
import { resolveContentById } from '../utils/homeContentUtils';
import { APP_LAYOUT } from '../theme/layout';

const BookmarksScreen = () => {
  const { bookmarks } = useBookmarks();
  const { colors, isDarkMode } = useTheme();
  const navigation = useNavigation();

  const resolvedBookmarks = useMemo(() => {
    return bookmarks.map((b) => {
      const resolved = resolveContentById(b.id);
      if (resolved) return resolved;
      return { id: b.id, title: b.title, kind: b.kind };
    });
  }, [bookmarks]);

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <ScreenWrapper>
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        {/* Premium Header */}
        <View style={styles.headerContainer}>
            <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                <Defs>
                    <LinearGradient id="bookmarkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor={colors.saffron} stopOpacity="1" />
                        <Stop offset="100%" stopColor={colors.orange} stopOpacity="1" />
                    </LinearGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#bookmarkGrad)" />
            </Svg>
            <View className="flex-row items-center px-5 h-full">
                <Pressable 
                  onPress={goBack} 
                  className="w-10 h-10 items-center justify-center rounded-xl bg-white/20 mr-3"
                >
                    <ChevronLeft color="#FFFFFF" size={28} />
                </Pressable>
                <Text className="text-xl font-pbold text-white">मेरा संग्रह</Text>
            </View>
        </View>

        <View className="flex-1">
          <FlatList
            data={resolvedBookmarks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="mb-4">
                <ItemCard
                  id={item.id}
                  title={item.title}
                  item={item}
                  onPress={() => navigation.navigate('Detail', { item })}
                />
              </View>
            )}
            contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
            initialNumToRender={10}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              resolvedBookmarks.length > 0 ? (
                <Text 
                  className="mb-6 font-pbold text-[18px] mt-2"
                  style={{ color: colors.text }}
                >
                  बुकमार्क किए गए पाठ ({resolvedBookmarks.length})
                </Text>
              ) : null
            }
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center mt-32 px-10">
                <View 
                    className="w-20 h-20 rounded-full items-center justify-center mb-6"
                    style={{ backgroundColor: colors.saffron + '10' }}
                >
                    <Heart size={40} color={colors.saffron + '40'} />
                </View>
                <Text
                  className="text-center font-pbold text-lg mb-2"
                  style={{ color: colors.text }}
                >
                  आपका संग्रह खाली है
                </Text>
                <Text
                  className="text-center font-pmedium text-[15px] leading-[24px]"
                  style={{ color: colors.textLight }}
                >
                  अपनी पसंदीदा आरती या मंत्र को सहेजने के लिए पाठ पढ़ते समय दिल (♡) आइकन पर टैप करें।
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
    headerContainer: {
        height: APP_LAYOUT.headerHeight + 20,
        width: '100%',
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    }
});

export default BookmarksScreen;

