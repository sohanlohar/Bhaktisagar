import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet } from 'react-native';
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

    const renderItem = useCallback(({ item }) => (

        <View style={styles.cardWrapper}>

            <ItemCard
                id={item.id}
                title={item.title}
                item={item}
                onPress={() => openDetail(item)}
            />

        </View>

    ), [openDetail]);

    const clearSearch = useCallback(() => {
        setSearchQuery('');
    }, []);

    /* ---------- UI ---------- */

    return (
        <ScreenWrapper>

            <View style={[styles.container, { backgroundColor: colors.background }]}>

                {/* Header */}

                <View
                    className="px-4 py-3 flex-row items-center"
                    style={{ backgroundColor: colors.headerBg }}
                >

                    <Pressable
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <ArrowLeft size={24} color={colors.headerText} />
                    </Pressable>

                    <View
                        style={[
                            styles.searchBar,
                            { backgroundColor: colors.white + '22' }
                        ]}
                    >

                        <SearchIcon
                            size={20}
                            color={colors.headerText}
                            style={styles.searchIcon}
                        />

                        <TextInput
                            placeholder="आज क्या पढ़ना चाहेंगे?"
                            placeholderTextColor={colors.headerText + '88'}
                            style={[styles.input, { color: colors.headerText }]}
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

                    <View style={styles.emptyContainer}>

                        <SearchIcon size={64} color={colors.border} />

                        <Text
                            style={[
                                styles.emptyText,
                                { color: colors.textLight }
                            ]}
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
                        renderItem={renderItem}

                        contentContainerStyle={styles.listContent}

                        initialNumToRender={8}
                        maxToRenderPerBatch={10}
                        windowSize={10}
                        removeClippedSubviews

                        showsVerticalScrollIndicator={false}

                        ListEmptyComponent={

                            <View style={styles.emptyContainer}>

                                <Text
                                    style={[
                                        styles.emptyText,
                                        { color: colors.textLight }
                                    ]}
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

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    backButton: {
        padding: 4,
    },

    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
    },

    searchIcon: {
        marginRight: 8,
    },

    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 8,
        fontWeight: '500',
    },

    listContent: {
        padding: 16,
    },

    cardWrapper: {
        marginBottom: 16,
    },

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },

    emptyText: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '500',
    },

});

export default SearchScreen;