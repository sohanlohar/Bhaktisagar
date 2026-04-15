import React, { useMemo } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { ChevronLeft, Heart } from 'lucide-react-native';
import BhaktiLoader from '../components/BhaktiLoader';

// Data
import mantras from '../data/mantras.json';
import chalisas from '../data/chalisas.json';
import bhajans from '../data/bhajans.json';
import aartis from '../data/aartis.json';
import stotras from '../data/stotram.json';
import { useBookmarks } from '../hooks/useBookmarks';
import { APP_LAYOUT } from '../theme/layout';


const BROWSE_DATA = {
    mantra: mantras,
    chalisa: chalisas,
    bhajan: bhajans,
    aarti: aartis,
    stotra: stotras,
};

export default function BrowseCategoryScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { colors } = useTheme();
    const { toggle, isBookmarked } = useBookmarks();
    const { kind, title } = route.params || {};

    const [loading, setLoading] = React.useState(true);

    const data = useMemo(() => BROWSE_DATA[kind] || [], [kind]);
    const headerBarStyle = useMemo(
        () => ({
            minHeight: APP_LAYOUT.headerHeight,
            backgroundColor: colors.headerBg,
        }),
        [colors.headerBg]
    );

    const heroBgStyle = useMemo(
        () => ({ backgroundColor: colors.saffron + '10' }),
        [colors.saffron]
    );

    const itemTitleStyle = useMemo(
        () => ({ color: colors.text }),
        [colors.text]
    );

    const deityStyle = useMemo(
        () => ({ color: colors.textLight }),
        [colors.textLight]
    );

    React.useEffect(() => {

        const timer = setTimeout(() => {
            setLoading(false);
        }, 400);

        return () => clearTimeout(timer);
    }, [kind]);

    if (!kind || !title) {
        return (
            <ScreenWrapper>
                <View className="flex-row items-center px-4 py-3" style={headerBarStyle}>
                    <Pressable onPress={() => navigation.goBack()} className="mr-3">
                        <ChevronLeft color={colors.headerText} size={28} />
                    </Pressable>
                    <Text className="font-psemibold text-[16px] leading-[24px]" style={{ color: colors.headerText }}>श्रेणी</Text>
                </View>
                <BhaktiLoader message="कोई डेटा उपलब्ध नहीं है।" />
            </ScreenWrapper>
        );
    }

    if (loading) {
        return (
            <ScreenWrapper>
                <View className="flex-row items-center px-4 py-3" style={headerBarStyle}>
                    <Pressable onPress={() => navigation.goBack()} className="mr-3">
                        <ChevronLeft color={colors.headerText} size={28} />
                    </Pressable>
                    <Text className="font-psemibold text-[16px] leading-[24px]" style={{ color: colors.headerText }}>{title}</Text>
                </View>
                <BhaktiLoader message={`${title} लोड हो रहा है...`} />
            </ScreenWrapper>
        );
    }

    const renderItem = ({ item }) => {

        const bookmarked = isBookmarked(item.id);

        const handleBookmark = (e) => {
            e.stopPropagation();
            toggle({ ...item, kind });
        };

        return (
            <Pressable
                onPress={() => navigation.navigate('Detail', { item: { ...item, kind } })}
                className="flex-1 m-2 rounded-[24px] border overflow-hidden shadow-sm"
                style={{
                    width: '48%',
                    aspectRatio: 0.8,
                    backgroundColor: colors.cardBg,
                    borderColor: colors.border,
                }}
            >
                <View className="flex-1">

                    <View
                        className="flex-1 items-center justify-center"
                        style={heroBgStyle}
                    >

                        <Text className="text-4xl">🕉️</Text>

                        <Pressable
                            onPress={handleBookmark}
                            className="absolute top-2 right-2 p-2 rounded-full"
                            style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
                        >
                            <Heart
                                size={20}
                                color={bookmarked ? colors.saffron : colors.textLight}
                                fill={bookmarked ? colors.saffron : 'none'}
                            />
                        </Pressable>
                    </View>

                    <View className="p-3">
                        <Text
                            className="text-center font-pbold text-[14px]"
                            style={itemTitleStyle}
                            numberOfLines={2}
                        >
                            {item.title}
                        </Text>
                        {item.deity?.name && (
                            <Text
                                className="text-center text-[11px] mt-1"
                                style={deityStyle}
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
            <View className="flex-1" style={{ backgroundColor: colors.background }}>
                {/* Header */}
                <View className="flex-row items-center px-4 py-3" style={headerBarStyle}>
                    <Pressable onPress={() => navigation.goBack()} className="mr-3">
                        <ChevronLeft color={colors.headerText} size={28} />
                    </Pressable>
                    <Text className="font-psemibold text-[16px] leading-[24px]" style={{ color: colors.headerText }}>{title}</Text>
                </View>

                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    initialNumToRender={8}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                    removeClippedSubviews
                    contentContainerStyle={{ padding: 8, paddingBottom: 100 }}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View className="flex-1 items-center justify-center mt-20">
                             <Text className="font-pmedium text-[16px] leading-[26px]" style={{ color: colors.textLight }}>
                                 कोई डेटा उपलब्ध नहीं है।
                             </Text>
                        </View>
                    }
                />
            </View>
        </ScreenWrapper>
    );
}