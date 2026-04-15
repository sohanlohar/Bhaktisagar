import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TextInput, FlatList, Pressable } from 'react-native';
import { Search as SearchIcon, ArrowLeft, X } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import ScreenWrapper from '../components/ScreenWrapper';
import { useTheme } from '../context/ThemeContext';
import ItemCard from '../components/ItemCard';

import aartis from '../data/aartis.json';
import chalisas from '../data/chalisas.json';
import bhajans from '../data/bhajans.json';
import mantras from '../data/mantras.json';

import { ROUTES } from '../constants';
import { APP_LAYOUT } from '../theme/layout';


const SearchScreen = () => {

    const { colors } = useTheme();
    const navigation = useNavigation();

    const [searchQuery, setSearchQuery] = useState('');

    /* ---------- Combine Data Once ---------- */

    const allContent = useMemo(() => {

        const normalize = (item, kind) => ({
            ...item,
            kind,
            _title: item.title?.toLowerCase() || '',
            _tags: item.tags?.map(t => t.toLowerCase()) || [],
        });

        return [
            ...aartis.map(i => normalize(i, 'aarti')),
            ...chalisas.map(i => normalize(i, 'chalisa')),
            ...bhajans.map(i => normalize(i, 'bhajan')),
            ...mantras.map(i => normalize(i, 'mantra')),
        ];

    }, []);

    /* ---------- Filter Results ---------- */

    const results = useMemo(() => {

        const query = searchQuery.trim().toLowerCase();

        if (!query) return [];

        const filtered = allContent.filter(item => {

            if (item._title.includes(query)) return true;

            return item._tags.some(tag =>
                tag === query || tag.startsWith(query)
            );

        });

        return filtered.sort((a, b) => {

            const aTitle = a._title.includes(query);
            const bTitle = b._title.includes(query);

            if (aTitle && !bTitle) return -1;
            if (!aTitle && bTitle) return 1;

            return 0;

        });

    }, [searchQuery, allContent]);

    /* ---------- Handlers ---------- */

    const openDetail = useCallback((item) => {

        navigation.navigate(ROUTES.DETAIL, {
            item: { ...item, kind: item.kind }
        });

    }, [navigation]);

    /* ---------- UI ---------- */

    return (
        <ScreenWrapper>
            <View className="flex-1" style={{ backgroundColor: colors.background }}>
                {/* Header */}

                <View
                    className="px-4 py-3 flex-row items-center"
                    style={{ minHeight: APP_LAYOUT.headerHeight, backgroundColor: colors.headerBg }}
                >

                    <Pressable
                        onPress={() => navigation.goBack()}
                        className="p-1"
                    >
                        <ArrowLeft size={24} color={colors.headerText} />
                    </Pressable>

                    <View
                        className="flex-1 flex-row items-center rounded-lg px-3 h-11"
                        style={{ backgroundColor: colors.white + '22' }}
                    >
                        <SearchIcon
                            size={20}
                            color={colors.headerText}
                            className="mr-2"
                        />

                        <TextInput
                            placeholder="आज क्या पढ़ना चाहेंगे?"
                            placeholderTextColor={colors.headerText + '88'}
                            className="flex-1 text-base font-pmedium"
                            style={{ color: colors.headerText }}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoFocus
                        />

                        {searchQuery.length > 0 && (
                            <Pressable onPress={clearSearch}>
                                <X size={20} color={colors.headerText} />
                            </Pressable>
                        )}

                    </View>

                </View>

                {/* Empty State */}

                {searchQuery.trim() === '' && (
                    <View className="flex-1 justify-center items-center pb-24">
                        <SearchIcon size={64} color={colors.border} />

                        <Text
                            className="mt-4 text-center font-pmedium text-[16px] leading-[26px]"
                            style={{ color: colors.textLight }}
                        >
                            भजन, आरती या चालीसा खोजें
                        </Text>
                    </View>
                )}

                {/* Results */}

                {searchQuery.trim() !== '' && (
                    <FlatList
                        data={results}
                        keyExtractor={(item) => `${item.kind}-${item.id}`}
                        renderItem={({ item }) => (
                            <View className="mb-4">
                                <ItemCard
                                    id={item.id}
                                    title={item.title}
                                    item={item}
                                    onPress={() => openDetail(item)}
                                />
                            </View>
                        )}
                        contentContainerStyle={{ padding: 16 }}
                        initialNumToRender={8}
                        maxToRenderPerBatch={10}
                        windowSize={10}
                        removeClippedSubviews
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View className="flex-1 justify-center items-center pb-24">
                                <Text
                                    className="font-pmedium text-[16px] leading-[26px]"
                                    style={{ color: colors.textLight }}
                                >
                                    कोई परिणाम नहीं मिला
                                </Text>
                            </View>
                        }
                    />
                )}

            </View>

        </ScreenWrapper>
    );
};

export default SearchScreen;