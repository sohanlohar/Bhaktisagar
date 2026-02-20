import React, { useMemo } from 'react';
import { View, Text, FlatList, Pressable, Image, StyleSheet } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { Search, ChevronLeft, Bookmark } from 'lucide-react-native';
import { useBookmarks } from '../hooks/useBookmarks';

// Import data
import mantras from '../data/mantras.json';
import chalisas from '../data/chalisas.json';
import bhajans from '../data/bhajans.json';
import aartis from '../data/aartis.json';

const BROWSE_DATA = {
    mantra: mantras,
    chalisa: chalisas,
    bhajan: bhajans,
    aarti: aartis,
};

export default function BrowseCategoryScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { colors } = useTheme();
    const { kind, title } = route.params;
    const { isBookmarked, toggle } = useBookmarks();

    const data = useMemo(() => BROWSE_DATA[kind] || [], [kind]);

    const renderItem = ({ item }) => {
        const bookmarked = isBookmarked(item.id);

        return (
            <Pressable
                onPress={() => navigation.navigate('Detail', { item: { ...item, kind } })}
                className="flex-1 m-2 rounded-[24px] border overflow-hidden shadow-sm"
                style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.border,
                    aspectRatio: 0.8
                }}
            >
                <View className="flex-1">
                    {/* Placeholder for Image */}
                    <View className="flex-1 bg-saffron/10 items-center justify-center" style={{ backgroundColor: colors.saffron + '10' }}>
                        {item.media?.icon ? (
                            <Text className="text-4xl">🕉️</Text>
                        ) : (
                            <Text className="text-4xl">🕉️</Text>
                        )}

                        <Pressable
                            onPress={() => toggle({ ...item, kind })}
                            className="absolute top-2 right-2 p-2 rounded-full"
                            style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
                        >
                            <Bookmark
                                size={16}
                                color={bookmarked ? colors.saffron : colors.textLight}
                                fill={bookmarked ? colors.saffron : 'none'}
                            />
                        </Pressable>
                    </View>

                    <View className="p-3">
                        <Text
                            className="text-center font-bold text-[14px]"
                            style={{ color: colors.text }}
                            numberOfLines={2}
                        >
                            {item.title}
                        </Text>
                        {item.deity?.name && (
                            <Text
                                className="text-center text-[11px] mt-1"
                                style={{ color: colors.textLight }}
                                numberOfLines={1}
                            >
                                {item.deity.name}
                            </Text>
                        )}
                    </View>
                </View>
            </Pressable>
        );
    };

    return (
        <ScreenWrapper>
            <View style={{ flex: 1, backgroundColor: colors.background }}>
                {/* Header */}
                <View className="flex-row items-center px-4 py-4" style={{ backgroundColor: colors.headerBg }}>
                    <Pressable onPress={() => navigation.goBack()} className="p-2">
                        <ChevronLeft color={colors.headerText} size={24} />
                    </Pressable>
                    <Text className="text-xl font-bold ml-2" style={{ color: colors.headerText }}>
                        {title}
                    </Text>
                </View>

                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={{ padding: 8, paddingBottom: 100 }}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View className="flex-1 items-center justify-center mt-20">
                            <Text style={{ color: colors.textLight }}>इस श्रेणी में कोई डेटा नहीं है।</Text>
                        </View>
                    }
                />
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    cardShadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    }
});
