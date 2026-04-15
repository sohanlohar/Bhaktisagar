import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, ScrollView, FlatList, Text } from 'react-native';
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

const HOME_CATEGORIES = [
  { id: '1', title: 'मंत्र', icon: '🙏', kind: 'mantra' },
  { id: '2', title: 'चालीसा', icon: '🎶', kind: 'chalisa' },
  { id: '3', title: 'भजन', icon: '🎶', kind: 'bhajan' },
  { id: '4', title: 'आरती', icon: '🪔', kind: 'aarti' },
  { id: '5', title: 'स्तोत्र', icon: '📜', kind: 'stotra' },

];

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
    <View className="items-center mt-8 mb-6">
      <Text className="text-2xl font-bold" style={{ color: colors.orange }}>
        {title} <Text style={{ fontSize: 20 }}>›</Text>
      </Text>
    </View>
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

    const loadData = async () => {

      try {

        const panchangData = await getTodayPanchang();
        setPanchang(panchangData);

        // Defer heavy home-content filtering/sorting so the UI stays responsive.
        // (Prevents a brief freeze that can impact immediate tab presses.)
        setTimeout(() => {
          const content = getHomePageContent();
          setHomeContent(content);
        }, 0);

      } catch (err) {

        console.error("Home load error", err);

      } finally {

        setLoading(false);

      }

    };

    loadData();

  }, []);

  const openDetail = useCallback((item) => {

    navigation.navigate('Detail', {
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

  const todaysDevotion = useMemo(() => homeContent.todaysDevotion, [homeContent]);
  const dailyPicks = useMemo(() => homeContent.dailyPicks, [homeContent]);
  const trending = useMemo(() => homeContent.trending, [homeContent]);

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

      <View style={{ flex: 1, backgroundColor: colors.background }}>

        <BhaktiHeader />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >

          {/* Categories */}

          <View className="mt-2 flex items-center">

            <FlatList
              data={HOME_CATEGORIES}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 10 }}
              renderItem={renderCategory}
            />

          </View>

          {/* Panchang */}

          <SectionHeader title="आज का पंचांग" />

          {panchang
            ? <PanchangSection panchang={panchang} />
            : (
              <View className="mt-4 flex-row justify-center px-4 flex-wrap">
                <CategoryPill label="तिथि" color={colors.pillYellow} />
                <CategoryPill label="राशिफल" color={colors.pillRed} />
                <CategoryPill label="राहुकाल" color={colors.pillDarkGreen} />
              </View>
            )
          }

          {/* Today's Devotion */}

          {todaysDevotion.length > 0 && (
            <>
              <SectionHeader title="आज की भक्ति" />

              <View className="px-4 flex-row flex-wrap justify-between">

                {todaysDevotion.map((item) => (
                  <View key={item.id} style={{ width: '48%', marginBottom: 12 }}>
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

          {/* Daily Picks */}

          {dailyPicks.length > 0 && (
            <>
              <SectionHeader title="दैनिक चयन" />

              <View className="px-3 flex-row flex-wrap">

                {dailyPicks.map(item => (
                  <View key={item.id} style={{ width: '50%' }}>
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

          {/* Trending */}

          {trending.length > 0 && (
            <>
              <SectionHeader title="लोकप्रिय" />

              <View className="px-4">

                <FlatList
                  data={trending}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  renderItem={renderTrending}
                  contentContainerStyle={{ paddingVertical: 8 }}
                  initialNumToRender={6}
                  maxToRenderPerBatch={6}
                  windowSize={8}
                  removeClippedSubviews
                />

              </View>
            </>
          )}

        </ScrollView>

      </View>

    </ScreenWrapper>
  );
}