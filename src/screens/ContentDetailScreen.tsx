import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useBookmarks } from '../hooks/useBookmarks';
import { useTheme } from '../context/ThemeContext';
import { Bookmark, ChevronLeft, Type, Share2 } from 'lucide-react-native';
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
    const bookmarked = isBookmarked(item?.id);

    if (!item) return null;

    const increaseFont = () => setFontSize(p => Math.min(p + 2, 30));
    const decreaseFont = () => setFontSize(p => Math.max(p - 2, 14));

    return (
        <ScreenWrapper>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                {/* Header */}
                <View style={[styles.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
                    <Pressable onPress={() => navigation.goBack()} hitSlop={10} className="w-10 h-10 items-center justify-center rounded-xl" style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
                        <ChevronLeft color={colors.headerText} size={28} />
                    </Pressable>

                    <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
                        {item.title}
                    </Text>

                    <View style={styles.headerActions}>
                        <Pressable onPress={() => toggle({ ...item, timestamp: Date.now() })} style={styles.iconBtn}>
                            <Bookmark
                                color={bookmarked ? colors.saffron : colors.text}
                                fill={bookmarked ? colors.saffron : 'none'}
                                size={24}
                            />
                        </Pressable>
                        <Pressable style={styles.iconBtn}>
                            <Share2 color={colors.text} size={22} />
                        </Pressable>
                    </View>
                </View>

                {/* Content Area */}
                <ScrollView contentContainerStyle={styles.contentScroll} showsVerticalScrollIndicator={false}>
                    <View className="items-center mb-8">
                        <View className="w-20 h-1 bg-saffron/20 rounded-full mb-6" style={{ backgroundColor: colors.saffron + '33' }} />

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
        padding: 16,
        paddingTop: 10,
        borderBottomWidth: 1,
        elevation: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        marginLeft: 15,
        textAlign: 'center'
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    iconBtn: {
        padding: 8,
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
