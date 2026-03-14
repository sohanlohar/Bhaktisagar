import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Heart, Share2, Type } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useTheme } from '../context/ThemeContext';
import { useBookmarks } from '../hooks/useBookmarks';
import BhaktiLoader from '../components/BhaktiLoader';
import { RootStackParamList } from '../types';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;

const ContentDetailScreen = () => {
    const route = useRoute<DetailScreenRouteProp>();
    const navigation = useNavigation();
    const { item } = route.params || {};

    // Hooks
    const { isBookmarked, toggle } = useBookmarks();
    const { colors, isDarkMode } = useTheme();

    // Local State
    const [fontSize, setFontSize] = useState(18);
    const [loading, setLoading] = useState(true);
    const bookmarked = isBookmarked(item?.id);

    React.useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [item?.id]);

    if (!item) return <BhaktiLoader message="सामग्री खोजी जा रही है..." />;
    
    if (loading) {
        return (
            <ScreenWrapper>
                <View
                    style={[
                        styles.header,
                        { backgroundColor: colors.headerBg, borderBottomColor: colors.border },
                    ]}
                >
                    <View style={styles.headerLeft}>
                        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
                            <ChevronLeft color={colors.headerText} size={28} />
                        </Pressable>
                        <Text style={[styles.headerTitle, { color: colors.headerText || "#F7F6E5" }]}>
                            {item.title}
                        </Text>
                    </View>
                </View>
                <BhaktiLoader />
            </ScreenWrapper>
        );
    }

    const increaseFont = () => setFontSize(p => Math.min(p + 2, 30));
    const decreaseFont = () => setFontSize(p => Math.max(p - 2, 14));

    return (
        <ScreenWrapper>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                {/* Header */}
                <View
                    style={[
                        styles.header,
                        { backgroundColor: colors.headerBg, borderBottomColor: colors.border },
                    ]}
                >
                    {/* Left Side */}
                    <View style={styles.headerLeft}>
                        <Pressable
                            onPress={() => navigation.goBack()}
                            hitSlop={10}
                            style={[
                                styles.backBtn,
                                { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' },
                            ]}
                        >
                            <ChevronLeft color={colors.headerText} size={28} />
                        </Pressable>

                        <Text
                            style={[styles.headerTitle, { color: colors.headerText || "#F7F6E5" }]}
                            numberOfLines={1}
                        >
                            {item.title}
                        </Text>
                    </View>

                    {/* Right Side */}
                    <View style={styles.headerActions}>
                        <Pressable onPress={() => toggle({ ...item, timestamp: Date.now() })} style={styles.iconBtn}>
                            <Heart
                                color={bookmarked ? colors.saffron : colors.headerText || "#F7F6E5"}
                                fill={bookmarked ? colors.saffron : 'none'}
                                size={24}
                            />
                        </Pressable>

                        <Pressable style={styles.iconBtn}>
                            <Share2 color={colors.headerText || "#F7F6E5"} size={22} />
                        </Pressable>
                    </View>
                </View>

                {/* Content Area */}
                <ScrollView contentContainerStyle={styles.contentScroll} showsVerticalScrollIndicator={false}>
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

                    <Text style={[styles.lyrics, { fontSize, color: colors.text, lineHeight: fontSize * 1.8 }]}>
                        {item.lyrics || item.content || 'विषय-वस्तु जल्द ही आ रही है...'}
                    </Text>
                </ScrollView>
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
        justifyContent: 'space-between',
        padding: 8,
        borderBottomWidth: 1,
        elevation: 2,
    },

    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    backBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
    },

    headerTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 10,
        flexShrink: 1,
    },

    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    iconBtn: {
        padding: 8,
        marginLeft: 6,
    },
    contentScroll: {
        padding: 24,
        paddingBottom: 40,
    },
    lyrics: {
        textAlign: 'center',
        fontWeight: '500',
    }
});

export default ContentDetailScreen;
