import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Pressable, ScrollView, Text, View, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Heart, Type, Share2 } from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, RadialGradient } from 'react-native-svg';

import ScreenWrapper from '../components/ScreenWrapper';
import { useTheme } from '../context/ThemeContext';
import { useBookmarks } from '../hooks/useBookmarks';
import BhaktiLoader from '../components/BhaktiLoader';
import { RootStackParamList } from '../types';
import { APP_LAYOUT } from '../theme/layout';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

const ContentDetailScreen = () => {
    const route = useRoute<DetailScreenRouteProp>();
    const navigation = useNavigation();
    const { item } = route.params || {};

    // Hooks
    const { toggle, isBookmarked } = useBookmarks();
    const { colors, isDarkMode } = useTheme();

    // Local State
    const [fontSize, setFontSize] = useState(20);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 400); // Slightly longer for a smoother feel
        return () => clearTimeout(timer);
    }, [item?.id]);

    const bookmarked = useMemo(() => {
        if (!item?.id) return false;
        return isBookmarked(item.id);
    }, [isBookmarked, item?.id]);

    const increaseFont = useCallback(() => setFontSize(p => Math.min(p + 2, 34)), []);
    const decreaseFont = useCallback(() => setFontSize(p => Math.max(p - 2, 16)), []);

    const handleBookmark = useCallback(() => {
        if (item) {
            toggle({
                id: item.id,
                title: item.title,
                kind: item.kind,
            });
        }
    }, [item, toggle]);

    if (!item) {
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
                    <View className="flex-row items-center px-5 flex-1">
                        <Pressable onPress={() => navigation.goBack()} className="w-10 h-10 items-center justify-center rounded-xl bg-white/10">
                            <ChevronLeft color="#FFFFFF" size={28} />
                        </Pressable>
                        <Text className="ml-4 text-lg font-pbold text-white" numberOfLines={1}>{item.title}</Text>
                    </View>
                </View>
                <BhaktiLoader message="पवित्र पाठ लोड हो रहा है..." />
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper>
            <View className="flex-1" style={{ backgroundColor: colors.background }}>
                {/* Premium Gradient Header */}
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

                    <View className="flex-row items-center justify-between px-5 h-full">
                        <View className="flex-row items-center flex-1">
                            <Pressable 
                                onPress={() => navigation.goBack()} 
                                className="w-10 h-10 items-center justify-center rounded-xl bg-white/20"
                            >
                                <ChevronLeft color="#FFFFFF" size={28} />
                            </Pressable>
                            <Text 
                                className="ml-4 text-[17px] font-pbold text-white flex-shrink" 
                                numberOfLines={1}
                            >
                                {item.title}
                            </Text>
                        </View>

                        <View className="flex-row items-center">
                            <Pressable onPress={handleBookmark} className="p-2 ml-1">
                                <Heart
                                    color={bookmarked ? "#FFFFFF" : "rgba(255,255,255,0.7)"}
                                    fill={bookmarked ? "#FFFFFF" : "none"}
                                    size={24}
                                />
                            </Pressable>
                            <Pressable className="p-2 ml-1">
                                <Share2 color="rgba(255,255,255,0.9)" size={22} />
                            </Pressable>
                        </View>
                    </View>
                </View>

                {/* Content Area with Divine Aura Background */}
                <View className="flex-1 overflow-hidden">
                    <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                        <Defs>
                            <RadialGradient
                                id="aura"
                                cx="50%"
                                cy="30%"
                                rx="50%"
                                ry="50%"
                                fx="50%"
                                fy="30%"
                                gradientUnits="userSpaceOnUse"
                            >
                                <Stop offset="0%" stopColor={colors.saffron} stopOpacity={isDarkMode ? 0.08 : 0.05} />
                                <Stop offset="100%" stopColor={colors.background} stopOpacity="1" />
                            </RadialGradient>
                        </Defs>
                        <Rect width="100%" height="100%" fill="url(#aura)" />
                    </Svg>

                    <ScrollView
                        contentContainerStyle={{
                            padding: 28,
                            paddingBottom: 60,
                        }}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Interactive Font Bar */}
                        <View className="items-center mb-8">
                            <View className="flex-row items-center justify-center bg-white/40 dark:bg-black/20 rounded-full px-6 py-2 shadow-sm border border-white/60 dark:border-white/5">
                                <Pressable onPress={decreaseFont} className="p-2 hit-slop-10">
                                    <Type size={18} color={colors.textLight} />
                                </Pressable>
                                <View className="h-4 w-[1px] bg-gray-300 mx-4" style={{ backgroundColor: colors.border }} />
                                <Pressable onPress={increaseFont} className="p-2 hit-slop-10">
                                    <Type size={26} color={colors.text} />
                                </Pressable>
                            </View>
                        </View>

                        <Text
                            className="text-center font-pmedium transition-all"
                            style={{
                                fontSize,
                                color: colors.text,
                                lineHeight: Math.round(fontSize * 1.8),
                                letterSpacing: 0.3,
                            }}
                        >
                            {item.lyrics || item.content || 'कोई डेटा उपलब्ध नहीं है।'}
                        </Text>
                    </ScrollView>
                </View>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        height: APP_LAYOUT.headerHeight + 8,
        width: '100%',
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
    }
});

export default ContentDetailScreen;

