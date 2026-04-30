import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet } from 'react-native';
import { Search as SearchIcon, ArrowLeft, X, Sparkles } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

import ScreenWrapper from '../components/ScreenWrapper';
import { useTheme } from '../context/ThemeContext';
import ItemCard from '../components/ItemCard';

import aartis from '../data/aartis.json';
import chalisas from '../data/chalisas.json';
import bhajans from '../data/bhajans.json';
import mantras from '../data/mantras.json';
import stotram from '../data/stotram.json';

import { ROUTES } from '../constants';
import { APP_LAYOUT } from '../theme/layout';

const SearchScreen = () => {
    const { colors, isDarkMode } = useTheme();
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');

    /* ---------- Combine & Normalize Data ---------- */
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
            ...stotram.map(i => normalize(i, 'stotra')),
        ];
    }, []);

    /* ---------- Filter Results ---------- */
    const results = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return [];

        const filtered = allContent.filter(item => {
            if (item._title.includes(query)) return true;
            return item._tags.some(tag => tag === query || tag.startsWith(query));
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
        navigation.navigate(ROUTES.DETAIL || 'Detail', {
            item: { ...item, kind: item.kind }
        });
    }, [navigation]);

    const clearSearch = useCallback(() => setSearchQuery(''), []);

    return (
        <ScreenWrapper>
            <View className="flex-1" style={{ backgroundColor: colors.background }}>
                {/* Premium Search Header */}
                <View style={[styles.headerContainer, { backgroundColor: colors.headerBg }]}>
                    <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                        <Defs>
                            <LinearGradient id="searchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <Stop offset="0%" stopColor={colors.saffron} stopOpacity="1" />
                                <Stop offset="100%" stopColor={colors.orange} stopOpacity="1" />
                            </LinearGradient>
                        </Defs>
                        <Rect width="100%" height="100%" fill="url(#searchGrad)" />
                    </Svg>

                    <View className="px-5 flex-row items-center h-full">
                        <Pressable 
                            onPress={() => navigation.goBack()} 
                            className="w-10 h-10 items-center justify-center rounded-xl bg-white/20 mr-3"
                        >
                            <ArrowLeft size={24} color="#FFFFFF" />
                        </Pressable>

                        <View 
                            className="flex-1 flex-row items-center rounded-2xl px-4 h-12 bg-white/25 border border-white/30"
                        >
                            <SearchIcon size={18} color="#FFFFFF" className="mr-3" />
                            <TextInput
                                placeholder="भजन, मंत्र या आरती..."
                                placeholderTextColor="rgba(255,255,255,0.7)"
                                className="flex-1 text-base font-pmedium text-white p-0"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                autoFocus
                                selectionColor="#FFFFFF"
                            />
                            {searchQuery.length > 0 && (
                                <Pressable onPress={clearSearch} className="p-1">
                                    <X size={18} color="#FFFFFF" />
                                </Pressable>
                            )}
                        </View>
                    </View>
                </View>

                {/* Content Area */}
                <View className="flex-1">
                    {searchQuery.trim() === '' ? (
                        <View className="flex-1 justify-center items-center px-10">
                            <View 
                                className="w-24 h-24 rounded-full items-center justify-center mb-6"
                                style={{ backgroundColor: colors.saffron + '10' }}
                            >
                                <Sparkles size={48} color={colors.saffron + '40'} />
                            </View>
                            <Text 
                                className="text-center font-pbold text-xl mb-2"
                                style={{ color: colors.text }}
                            >
                                खोजें
                            </Text>
                            <Text 
                                className="text-center font-pmedium text-[15px] leading-[24px]" 
                                style={{ color: colors.textLight }}
                            >
                                अपनी पसंदीदा आरती, भजन या मंत्र खोजने के लिए ऊपर टाइप करें।
                            </Text>
                        </View>
                    ) : (
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
                            contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
                            initialNumToRender={10}
                            showsVerticalScrollIndicator={false}
                            ListHeaderComponent={
                                <Text className="font-psemibold text-xs uppercase tracking-widest mb-4 ml-1" style={{ color: colors.textLight }}>
                                    {results.length} परिणाम मिले
                                </Text>
                            }
                            ListEmptyComponent={
                                <View className="flex-1 justify-center items-center mt-20 px-10">
                                    <Text className="font-pbold text-lg mb-2 text-center" style={{ color: colors.text }}>
                                        क्षमा करें!
                                    </Text>
                                    <Text className="text-center font-pmedium" style={{ color: colors.textLight }}>
                                        हमें "{searchQuery}" के लिए कुछ भी नहीं मिला। कृपया कुछ और प्रयास करें।
                                    </Text>
                                </View>
                            }
                        />
                    )}
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
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
    }
});

export default SearchScreen;