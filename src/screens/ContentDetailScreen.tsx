import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Heart, Type } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
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
    const [fontSize, setFontSize] = useState(18);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [item?.id]);

    const bookmarked = useMemo(() => {
        if (!item?.id) return false;
        return isBookmarked(item.id);
    }, [isBookmarked, item?.id]);

    const increaseFont = useCallback(() => setFontSize(p => Math.min(p + 2, 30)), []);
    const decreaseFont = useCallback(() => setFontSize(p => Math.max(p - 2, 14)), []);

    if (!item) {
        return (
            <ScreenWrapper>
                <View
                    className="flex-row items-center justify-between px-5 py-2 border-b"
                    style={{
                        minHeight: APP_LAYOUT.headerHeight,
                        backgroundColor: colors.headerBg,
                        borderBottomColor: colors.border,
                    }}
                >
                    <View className="flex-row items-center flex-1">
                        <Pressable
                            onPress={() => navigation.goBack()}
                            className="w-10 h-10 items-center justify-center rounded-xl"
                        >
                            <ChevronLeft color={colors.headerText} size={28} />
                        </Pressable>
                        <Text
                            className="ml-3 text-base font-pbold"
                            style={{ color: colors.headerText || '#F7F6E5' }}
                            numberOfLines={1}
                        >
                            विवरण
                        </Text>
                    </View>
                </View>
                <BhaktiLoader message="कोई डेटा उपलब्ध नहीं है।" />
            </ScreenWrapper>
        );
    }

    if (loading) {
        return (
            <ScreenWrapper>
                <View
                    className="flex-row items-center justify-between px-5 py-2 border-b"
                    style={{
                        minHeight: APP_LAYOUT.headerHeight,
                        backgroundColor: colors.headerBg,
                        borderBottomColor: colors.border,
                    }}
                >
                    <View className="flex-row items-center flex-1">
                        <Pressable
                            onPress={() => navigation.goBack()}
                            className="w-10 h-10 items-center justify-center rounded-xl"
                        >
                            <ChevronLeft color={colors.headerText} size={28} />
                        </Pressable>
                        <Text
                            className="ml-3 text-base font-pbold"
                            style={{ color: colors.headerText || '#F7F6E5' }}
                        >
                            {item.title}
                        </Text>
                    </View>
                </View>
                <BhaktiLoader />
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper>
            <View className="flex-1" style={{ backgroundColor: colors.background }}>
                {/* Header */}
                <View
                    className="flex-row items-center justify-between px-5 py-2 border-b"
                    style={{
                        minHeight: APP_LAYOUT.headerHeight,
                        backgroundColor: colors.headerBg,
                        borderBottomColor: colors.border,
                    }}
                >
                    {/* Left Side */}
                    <View className="flex-row items-center flex-1">
                        <Pressable
                            onPress={() => navigation.goBack()}
                            hitSlop={10}
                            className="w-10 h-10 items-center justify-center rounded-xl"
                            style={{
                                backgroundColor: isDarkMode
                                    ? 'rgba(255,255,255,0.05)'
                                    : 'rgba(0,0,0,0.02)',
                            }}
                        >
                            <ChevronLeft color={colors.headerText} size={28} />
                        </Pressable>

                        <Text
                            className="ml-3 text-base font-pbold flex-shrink"
                            style={{ color: colors.headerText || '#F7F6E5' }}
                            numberOfLines={1}
                        >
                            {item.title}
                        </Text>
                    </View>

                    {/* Right Side */}
                    <View className="flex-row items-center">
                        <Pressable
                            onPress={() =>
                                toggle({
                                    id: item.id,
                                    title: item.title,
                                    kind: item.kind,
                                })
                            }
                            className="p-2 ml-2"
                        >
                            <Heart
                                color={bookmarked ? colors.primary : colors.headerText || '#F7F6E5'}
                                fill={bookmarked ? colors.primary : 'none'}
                                size={24}
                            />
                        </Pressable>

                        {/* <Pressable className="p-2 ml-2">
                            <Share2 color={colors.headerText || "#F7F6E5"} size={22} />
                        </Pressable> */}
                    </View>
                </View>

                {/* Content Area */}
                <ScrollView
                    contentContainerStyle={{
                        padding: 24,
                        paddingBottom: 40,
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="items-center mb-0">
                        <View className="w-20 h-1 bg-saffron/20 rounded-full mb-4" style={{ backgroundColor: colors.saffron + '50' }} />

                        <View className="flex-row items-center justify-center mb-10 w-full px-10">
                            <Pressable onPress={decreaseFont} className="p-2">
                                <Type size={16} color={colors.textLight} />
                            </Pressable>
                            <View className="h-0.5 flex-1 bg-gray-100 mx-4" style={{ backgroundColor: colors.border }} />
                            <Pressable onPress={increaseFont} className="p-2">
                                <Type size={24} color={colors.text} />
                            </Pressable>
                        </View>
                    </View>

                    <Text
                        className="text-center font-pmedium"
                        style={{
                            fontSize,
                            color: colors.text,
                            lineHeight: Math.round(fontSize * 1.8),
                        }}
                    >
                        {item.lyrics || item.content || 'कोई डेटा उपलब्ध नहीं है।'}
                    </Text>
                </ScrollView>
            </View>
        </ScreenWrapper>
    );
};

export default ContentDetailScreen;
