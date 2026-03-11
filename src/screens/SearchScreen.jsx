import React, { useState, useEffect, useMemo } from 'react';
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
    const [results, setResults] = useState([]);

    // Combine and sanitize all data once
    const allContent = useMemo(() => [
        ...aartis.map(item => ({ ...item, kind: 'aarti' })),
        ...chalisas.map(item => ({ ...item, kind: 'chalisa' })),
        ...bhajans.map(item => ({ ...item, kind: 'bhajan' })),
        ...mantras.map(item => ({ ...item, kind: 'mantra' })),
    ].filter(item => item && item.title && item.id), []);

    useEffect(() => {
        const query = searchQuery.trim().toLowerCase();
        if (query === '') {
            setResults([]);
            return;
        }

        const filtered = allContent.filter(item => {
            if (!item || !item.title) return false;

            const titleMatch = item.title.toLowerCase().includes(query);
            const tagMatch = item.tags && item.tags.some(tag =>
                tag.toLowerCase() === query || tag.toLowerCase().startsWith(query)
            );

            return titleMatch || tagMatch;
        });

        // Sort results: title matches first
        const sorted = [...filtered].sort((a, b) => {
            const aTitleMatch = a.title.toLowerCase().includes(query);
            const bTitleMatch = b.title.toLowerCase().includes(query);
            if (aTitleMatch && !bTitleMatch) return -1;
            if (!aTitleMatch && bTitleMatch) return 1;
            return 0;
        });

        setResults(sorted);
    }, [searchQuery, allContent]);

    return (
        <ScreenWrapper>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                {/* Header */}
                <View className="px-4 py-3 flex-row items-center" style={{ backgroundColor: colors.headerBg }}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ArrowLeft size={24} color={colors.headerText} />
                    </Pressable>

                    <View style={[styles.searchBar, { backgroundColor: colors.white + '22' }]}>
                        <SearchIcon size={20} color={colors.headerText} style={styles.searchIcon} />
                        <TextInput
                            placeholder="आज क्या पढ़ना चाहेंगे?"
                            placeholderTextColor={colors.headerText + '88'}
                            style={[styles.input, { color: colors.headerText }]}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoFocus
                        />
                        {searchQuery.length > 0 && (
                            <Pressable onPress={() => setSearchQuery('')}>
                                <X size={20} color={colors.headerText} />
                            </Pressable>
                        )}
                    </View>
                </View>

                {/* Content */}
                {searchQuery.trim() === '' ? (
                    <View style={styles.emptyContainer}>
                        <SearchIcon size={64} color={colors.border} />
                        <Text style={[styles.emptyText, { color: colors.textLight }]}>
                            भजन, आरती या चालीसा खोजें
                        </Text>
                    </View>
                ) : results.length > 0 ? (
                    <FlatList
                        data={results}
                        keyExtractor={(item) => `${item.kind}-${item.id}`}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => (
                            <View style={styles.cardWrapper}>
                                <ItemCard
                                    id={item.id}
                                    title={item.title}
                                    item={item}
                                    onPress={() =>
                                        navigation.navigate(ROUTES.DETAIL, {
                                            item: { ...item, kind: item.kind },
                                        })
                                    }
                                />
                            </View>
                        )}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyText, { color: colors.textLight }]}>
                            कोई परिणाम नहीं मिला
                        </Text>
                    </View>
                )}
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
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
