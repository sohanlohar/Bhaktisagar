import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, ScrollView, FlatList, Text, InteractionManager } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { IconTile } from '../components/IconTile';
import CategoryPill from '../components/CategoryPill';
import { GridListItem } from '../components/home/HomeComponents';
import ItemCard from '../components/ItemCard';
import { Music, Star, ScrollText, Sparkles, Zap } from 'lucide-react-native';
import PanchangSection from '../components/PanchangSection';
import { getTodayPanchang } from '../services/panchangApi';
import { getHomePageContent } from '../utils/homeContentUtils';
import { BhaktiHeader } from '../components/home/BhaktiHeader';
import { ROUTES } from '../constants';
import BhaktiLoader from '../components/BhaktiLoader';
import Animated, { FadeInDown } from 'react-native-reanimated';

const HOME_CATEGORIES = [
  { id: '1', title: 'मंत्र', icon: '🙏', kind: 'mantra' },
  { id: '2', title: 'चालीसा', icon: '🎶', kind: 'chalisa' },
  { id: '3', title: 'भजन', icon: '🎶', kind: 'bhajan' },
  { id: '4', title: 'आरती', icon: '🪔', kind: 'aarti' },
  { id: '5', title: 'स्तोत्र', icon: '📜', kind: 'stotra' },
];

const CATEGORY_ITEM_WIDTH = 96; // w-20 (80px) + mx-2 (8px * 2)
const TRENDING_ITEM_WIDTH = 292; // w-[280px] + mr-3 (12px)

const getKindIcon = (kind) => {
  switch (kind) {
    case 'mantra': return Sparkles;
    case 'chalisa': return ScrollText;
    case 'bhajan': return Music;
    case 'aarti': return Zap;
    default: return Star;
  }
};

const SectionHeader = React.memo(({ title }) => {
  const { colors } = useTheme();
  return (
    <Animated.View 
      entering={FadeInDown.duration(600).delay(100)}
      className="items-center mt-10 mb-6"
    >
      <View className="flex-row items-center">
        <View className="h-[1px] w-8 bg-orange-200 mr-3" />
        <Text 
          className="text-[20px] font-pbold tracking-tight text-center" 
          style={{ color: colors.orange }}
        >
          {title}
        </Text>
        <View className="h-[1px] w-8 bg-orange-200 ml-3" />
      </View>
      <View 
        className="h-1 w-6 rounded-full mt-1" 
        style={{ backgroundColor: colors.saffron + '40' }} 
      />
    </Animated.View>
  );
});

export default function HomeScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [panchang, setPanchang] = useState(null);
  const [loading, setLoading] = useState(true);

  const [homeContent, setHomeContent] = useState({
    todaysDevotion: [],
    dailyPicks: [],
    trending: [],
  });

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const panchangData = await getTodayPanchang();
        if (isMounted) setPanchang(panchangData);

        // Defer heavy home-content loading to ensure smooth navigation transition
        InteractionManager.runAfterInteractions(() => {
          if (isMounted) {
            const content = getHomePageContent();
            setHomeContent(content);
            setLoading(false);
          }
        });
      } catch (err) {
        console.error("Home load error", err);
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, []);

  const openDetail = useCallback((item) => {
    navigation.navigate(ROUTES.DETAIL || 'Detail', {
      item: { ...item, kind: item.kind }
    });
  }, [navigation]);

  const openCategory = useCallback((item) => {
    navigation.navigate(ROUTES.BROWSE_CATEGORY || 'BrowseCategory', {
      kind: item.kind,
      title: item.title,
    });
  }, [navigation]);

  const renderCategory = useCallback(({ item }) => (
    <IconTile
      icon={item.icon}
      label={item.title}
      isNew={item.isNew}
      onPress={() => openCategory(item)}
    />
  ), [openCategory]);

  const renderTrending = useCallback(({ item }) => (
    <View style={{ width: 280, marginRight: 12 }}>
      <ItemCard
        id={item.id}
        title={item.title}
        item={item}
        onPress={() => openDetail(item)}
      />
    </View>
  ), [openDetail]);

  const getCategoryLayout = useCallback((_, index) => ({
    length: CATEGORY_ITEM_WIDTH,
    offset: CATEGORY_ITEM_WIDTH * index,
    index,
  }), []);

  const getTrendingLayout = useCallback((_, index) => ({
    length: TRENDING_ITEM_WIDTH,
    offset: TRENDING_ITEM_WIDTH * index,
    index,
  }), []);

  if (loading) {
    return (
      <ScreenWrapper>
        <BhaktiHeader />
        <BhaktiLoader message="जय श्री राम..." />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        <BhaktiHeader />
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ paddingBottom: 40 }}
          removeClippedSubviews={true}
        >
          <View className="mt-2 px-2">
            <FlatList
              data={HOME_CATEGORIES}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={renderCategory}
              getItemLayout={getCategoryLayout}
              contentContainerStyle={{ paddingHorizontal: 10 }}
              initialNumToRender={5}
              windowSize={3}
            />

            <SectionHeader title="आज का पंचांग" />

            {panchang ? (
              <PanchangSection panchang={panchang} />
            ) : (
              <View className="mt-4 flex-row justify-center px-4 flex-wrap">
                <CategoryPill label="तिथि" color={colors.pillYellow} />
                <CategoryPill label="राशिफल" color={colors.pillRed} />
                <CategoryPill label="राहुकाल" color={colors.pillDarkGreen} />
              </View>
            )}

            {homeContent.todaysDevotion.length > 0 && (
              <>
                <SectionHeader title="आज की भक्ति" />
                <View className="px-4 flex-row flex-wrap justify-between">
                  {homeContent.todaysDevotion.map((item) => (
                    <View key={item.id} className="w-[48%] mb-3">
                      <ItemCard
                        id={item.id}
                        title={item.title}
                        item={item}
                        onPress={() => openDetail(item)}
                      />
                    </View>
                  ))}
                </View>
              </>
            )}

            {homeContent.dailyPicks.length > 0 && (
              <>
                <SectionHeader title="दैनिक चयन" />
                <View className="px-3 flex-row flex-wrap">
                  {homeContent.dailyPicks.map((item) => (
                    <View key={item.id} className="w-1/2">
                      <GridListItem
                        title={item.title}
                        icon={getKindIcon(item.kind)}
                        color={colors.primary}
                        onPress={() => openDetail(item)}
                      />
                    </View>
                  ))}
                </View>
              </>
            )}

            {homeContent.trending.length > 0 && (
              <>
                <SectionHeader title="लोकप्रिय" />
                <View className="px-4">
                  <FlatList
                    data={homeContent.trending}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    renderItem={renderTrending}
                    getItemLayout={getTrendingLayout}
                    contentContainerStyle={{ paddingVertical: 8 }}
                    initialNumToRender={3}
                    maxToRenderPerBatch={3}
                    windowSize={3}
                    removeClippedSubviews={true}
                  />
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}
