import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, InteractionManager, Dimensions, StyleSheet } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { ChevronLeft, Heart, Sparkles } from 'lucide-react-native';
import BhaktiLoader from '../components/BhaktiLoader';
import Svg, { Defs, LinearGradient, Stop, Rect, RadialGradient } from 'react-native-svg';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Data sources
import mantras from '../data/mantras.json';
import chalisas from '../data/chalisas.json';
import bhajans from '../data/bhajans.json';
import aartis from '../data/aartis.json';
import stotras from '../data/stotram.json';

import { useBookmarks } from '../hooks/useBookmarks';
import { APP_LAYOUT } from '../theme/layout';
import { ROUTES } from '../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const GRID_PADDING = 16;
const ITEM_MARGIN = 12;
const ITEM_WIDTH = (SCREEN_WIDTH - (GRID_PADDING * 2) - ITEM_MARGIN) / COLUMN_COUNT;

const BROWSE_DATA = {
    mantra: mantras,
    chalisa: chalisas,
    bhajan: bhajans,
    aarti: aartis,
    stotra: stotras,
};

// Refined Category Card with Animation
const CategoryItemCard = React.memo(({ item, kind, index, navigation, colors, isDarkMode, bookmarked, onBookmark }) => {
    return (
        <Animated.View 
            entering={FadeInDown.duration(600).delay(index * 100).springify()}
            className="mb-4"
        >
            <Pressable
                onPress={() => navigation.navigate(ROUTES.DETAIL || 'Detail', { item: { ...item, kind } })}
                style={[
                    styles.card,
                    { 
                        width: ITEM_WIDTH,
                        backgroundColor: colors.cardBg,
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,153,51,0.1)',
                    }
                ]}
            >
                {/* Card Top / Symbol Area */}
                <View 
                    style={{ backgroundColor: colors.saffron + '08' }}
                    className="h-32 items-center justify-center relative"
                >
                    <View 
                        className="w-16 h-16 rounded-full items-center justify-center"
                        style={{ backgroundColor: colors.saffron + '10' }}
                    >
                         <Text className="text-3xl text-center">🕉️</Text>
                    </View>
                    
                    <Pressable
                        onPress={() => onBookmark(item)}
                        hitSlop={10}
                        className="absolute top-3 right-3 w-8 h-8 items-center justify-center rounded-full bg-white/80 dark:bg-black/40 shadow-sm"
                    >
                        <Heart
                            size={16}
                            color={bookmarked ? colors.saffron : colors.textLight}
                            fill={bookmarked ? colors.saffron : 'none'}
                        />
                    </Pressable>
                </View>

                {/* Card Bottom / Text Area */}
                <View className="p-4 items-center">
                    <Text
                        className="text-center font-pbold text-[15px] mb-1"
                        style={{ color: colors.text }}
                        numberOfLines={2}
                    >
                        {item.title}
                    </Text>
                    <Text
                        className="text-center font-pmedium text-[11px] uppercase tracking-wider"
                        style={{ color: colors.saffron }}
                        numberOfLines={1}
                    >
                        {item.deity?.name || 'भक्ति'}
                    </Text>
                </View>
            </Pressable>
        </Animated.View>
    );
});

export default function BrowseCategoryScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { colors, isDarkMode } = useTheme();
    const { toggle, isBookmarked } = useBookmarks();
    const { kind, title } = route.params || {};

    const [loading, setLoading] = useState(true);

    const data = useMemo(() => BROWSE_DATA[kind] || [], [kind]);

    useEffect(() => {
        const task = InteractionManager.runAfterInteractions(() => {
            setLoading(false);
        });
        return () => task.cancel();
    }, [kind]);

    const handleBookmark = useCallback((item) => {
        toggle({ ...item, kind });
    }, [toggle, kind]);

    const renderItem = useCallback(({ item, index }) => (
        <CategoryItemCard 
            item={item} 
            kind={kind} 
            index={index}
            navigation={navigation} 
            colors={colors} 
            isDarkMode={isDarkMode}
            bookmarked={isBookmarked(item.id)} 
            onBookmark={handleBookmark}
        />
    ), [kind, navigation, colors, isDarkMode, isBookmarked, handleBookmark]);

    if (!kind || !title) {
        return (
            <ScreenWrapper>
                <BhaktiLoader message="कोई डेटा उपलब्ध नहीं है।" />
            </ScreenWrapper>
        );
    }

    if (loading) {
        return (
            <ScreenWrapper>
                <View style={styles.headerContainer}>
                    <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                        <Defs>
                            <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <Stop offset="0%" stopColor={colors.saffron} stopOpacity="1" />
                                <Stop offset="100%" stopColor={colors.orange} stopOpacity="1" />
                            </LinearGradient>
                        </Defs>
                        <Rect width="100%" height="100%" fill="url(#grad)" />
                    </Svg>
                    <View className="flex-row items-center px-5 h-full">
                        <Pressable onPress={() => navigation.goBack()} className="w-10 h-10 items-center justify-center rounded-xl bg-white/10">
                            <ChevronLeft color="#FFFFFF" size={28} />
                        </Pressable>
                        <Text className="ml-4 text-lg font-pbold text-white uppercase tracking-wider">{title}</Text>
                    </View>
                </View>
                <BhaktiLoader message={`${title} संकलित हो रहा है...`} />
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper>
            <View className="flex-1" style={{ backgroundColor: colors.background }}>
                {/* Premium Header */}
                <View style={styles.headerContainer}>
                    <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                        <Defs>
                            <LinearGradient id="gradHeader" x1="0%" y1="0%" x2="100%" y2="0%">
                                <Stop offset="0%" stopColor={colors.saffron} stopOpacity="1" />
                                <Stop offset="100%" stopColor={colors.orange} stopOpacity="1" />
                            </LinearGradient>
                        </Defs>
                        <Rect width="100%" height="100%" fill="url(#gradHeader)" />
                    </Svg>
                    <View className="flex-row items-center px-5 h-full">
                        <Pressable 
                            onPress={() => navigation.goBack()} 
                            className="w-10 h-10 items-center justify-center rounded-xl bg-white/20"
                        >
                            <ChevronLeft color="#FFFFFF" size={28} />
                        </Pressable>
                        <Text className="ml-4 text-lg font-pbold text-white uppercase tracking-wider">{title}</Text>
                    </View>
                </View>

                {/* Aura Background */}
                <View className="flex-1">
                    <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                        <Defs>
                            <RadialGradient id="aura" cx="50%" cy="40%" rx="50%" ry="50%" fx="50%" fy="40%" gradientUnits="userSpaceOnUse">
                                <Stop offset="0%" stopColor={colors.saffron} stopOpacity={isDarkMode ? 0.08 : 0.04} />
                                <Stop offset="100%" stopColor={colors.background} stopOpacity="1" />
                            </RadialGradient>
                        </Defs>
                        <Rect width="100%" height="100%" fill="url(#aura)" />
                    </Svg>

                    <FlatList
                        data={data}
                        keyExtractor={(item) => item.id}
                        numColumns={COLUMN_COUNT}
                        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: GRID_PADDING }}
                        initialNumToRender={8}
                        windowSize={5}
                        removeClippedSubviews={true}
                        contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View className="flex-1 items-center justify-center mt-32 px-10">
                                <Sparkles size={48} color={colors.saffron + '30'} />
                                <Text className="mt-4 text-center font-pmedium text-[16px]" style={{ color: colors.textLight }}>
                                    इस श्रेणी में अभी कोई पाठ उपलब्ध नहीं है।
                                </Text>
                            </View>
                        }
                    />
                </View>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        height: APP_LAYOUT.headerHeight + 10,
        width: '100%',
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
    },
    card: {
        borderRadius: 28,
        borderWidth: 1,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#FF9933',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    }
});