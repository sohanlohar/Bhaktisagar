import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, ScrollView, FlatList, Text, InteractionManager, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { IconTile } from '../components/IconTile';
import CategoryPill from '../components/CategoryPill';
import { GridListItem } from '../components/home/HomeComponents';
import ItemCard from '../components/ItemCard';
import { BookOpenText, CalendarDays, Music, Star, ScrollText, Sparkles, Zap } from 'lucide-react-native';
import PanchangSection from '../components/PanchangSection';
import { getTodayPanchang } from '../services/panchangApi';
import { getHomePageContent } from '../utils/homeContentUtils';
import { BhaktiHeader } from '../components/home/BhaktiHeader';
import { ROUTES } from '../constants';
import BhaktiLoader from '../components/BhaktiLoader';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { getDailyGitaGyan } from '../utils/gitaGyanUtils';

const HOME_CATEGORIES = [
  { id: '1', title: 'मंत्र', icon: '🙏', kind: 'mantra' },
  { id: '2', title: 'चालीसा', icon: 'ॐ', kind: 'chalisa' },
  { id: '3', title: 'भजन', icon: '🎼', kind: 'bhajan' },
  { id: '4', title: 'आरती', icon: '🪔', kind: 'aarti' },
  { id: '5', title: 'स्तोत्र', icon: '📜', kind: 'stotra' },
];

const CATEGORY_ITEM_WIDTH = 96; // w-20 (80px) + mx-2 (8px * 2)
const TRENDING_ITEM_WIDTH = 292; // w-[280px] + mr-3 (12px)

const styles = StyleSheet.create({
  featuredCard: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
});

const HINDI_WEEKDAYS = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
const HINDI_MONTHS = [
  'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर',
];

const getGreeting = (hour) => {
  if (hour < 12) return 'सुप्रभात';
  if (hour < 17) return 'शुभ दोपहर';
  return 'शुभ संध्या';
};

const getHindiDate = (date) =>
  `${HINDI_WEEKDAYS[date.getDay()]}, ${date.getDate()} ${HINDI_MONTHS[date.getMonth()]} ${date.getFullYear()}`;

const getKindIcon = (kind) => {
  switch (kind) {
    case 'mantra': return Sparkles;
    case 'chalisa': return ScrollText;
    case 'bhajan': return Music;
    case 'aarti': return Zap;
    default: return Star;
  }
};

const KIND_LABELS = {
  aarti: 'आरती',
  bhajan: 'भजन',
  chalisa: 'चालीसा',
  mantra: 'मंत्र',
  stotra: 'स्तोत्र',
};

const FeaturedDevotionCard = ({ item, colors, onPress }) => {
  const FeaturedIcon = getKindIcon(item.kind);
  const kindLabel = KIND_LABELS[item.kind] || 'भक्ति';

  return (
    <Pressable
      onPress={() => onPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`${kindLabel}: ${item.title}`}
      className="mx-4 mb-4 flex-row items-center rounded-3xl border p-4"
      style={[
        styles.featuredCard,
        {
          backgroundColor: colors.cardBg,
          borderColor: colors.saffron + '70',
          shadowColor: colors.orange,
        },
      ]}
    >
      <View
        className="mr-4 h-14 w-14 items-center justify-center rounded-2xl"
        style={{ backgroundColor: colors.saffron + '20' }}
      >
        <FeaturedIcon size={26} color={colors.orange} />
      </View>
      <View className="flex-1">
        <Text
          className="mb-1 text-[11px] font-pbold uppercase"
          style={{ color: colors.orange }}
        >
          आज का {kindLabel}
        </Text>
        <Text
          className="text-[15px] font-pbold"
          style={{ color: colors.text }}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text
          className="mt-1 text-xs font-pmedium"
          style={{ color: colors.textLight }}
        >
          पढ़ने के लिए टैप करें
        </Text>
      </View>
    </Pressable>
  );
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
  const [dailyGyan, setDailyGyan] = useState(() => getDailyGitaGyan());

  const [homeContent, setHomeContent] = useState({
    todaysDevotion: [],
    dailyPicks: [],
    trending: [],
  });

  const featuredDevotion = useMemo(
    () =>
      homeContent.todaysDevotion.find(
        (item) => item.kind === 'bhajan' || item.kind === 'aarti',
      ) || homeContent.todaysDevotion[0],
    [homeContent.todaysDevotion],
  );
  const otherDevotions = useMemo(
    () =>
      homeContent.todaysDevotion.filter(
        (item) => item.id !== featuredDevotion?.id,
      ),
    [homeContent.todaysDevotion, featuredDevotion],
  );

  useFocusEffect(
    useCallback(() => {
      setDailyGyan(getDailyGitaGyan());
    }, []),
  );

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
            <View className="px-4 pt-4 pb-2">
              <Text className="text-[22px] font-pbold" style={{ color: colors.text }}>
                {getGreeting(new Date().getHours())} 🙏
              </Text>
              <Text className="mt-1 text-sm font-pmedium" style={{ color: colors.textLight }}>
                {getHindiDate(new Date())}
              </Text>
            </View>

            <Pressable
              onPress={() => navigation.navigate(ROUTES.JAAP_COUNTER)}
              accessibilityRole="button"
              accessibilityLabel="डिजिटल जप काउंटर खोलें"
              className="mx-4 mb-4 flex-row items-center rounded-2xl border p-4"
              style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
            >
              <View className="mr-3 h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: colors.saffron + '20' }}>
                <Sparkles size={22} color={colors.orange} />
              </View>
              <View className="flex-1">
                <Text className="font-pbold" style={{ color: colors.text }}>डिजिटल जप</Text>
                <Text className="mt-1 text-xs font-pmedium" style={{ color: colors.textLight }}>अपना नाम चुनें और जप शुरू करें</Text>
              </View>
              <Text className="text-xl font-pbold" style={{ color: colors.orange }}>›</Text>
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate(ROUTES.GITA_GYAN)}
              accessibilityRole="button"
              accessibilityLabel="आज का गीता ज्ञान खोलें"
              className="mx-4 mb-4 rounded-2xl border p-4"
              style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
            >
              <View className="mb-3 flex-row items-center">
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: colors.saffron + '20' }}>
                  <BookOpenText size={21} color={colors.orange} />
                </View>
                <View className="flex-1">
                  <Text className="font-pbold" style={{ color: colors.text }}>आज का गीता ज्ञान</Text>
                  <Text className="mt-1 text-xs font-pmedium" style={{ color: colors.textLight }}>
                    अध्याय {dailyGyan.chapter}, श्लोक {dailyGyan.verse} · {dailyGyan.theme}
                  </Text>
                </View>
                <Text className="text-xl font-pbold" style={{ color: colors.orange }}>›</Text>
              </View>
              <Text className="text-sm font-pmedium" style={{ color: colors.text }} numberOfLines={2}>
                {dailyGyan.shloka}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate(ROUTES.ROOT_TABS, { screen: ROUTES.PANCHANG })}
              accessibilityRole="button"
              accessibilityLabel="पंचांग कैलेंडर खोलें"
              className="mx-4 mb-4 flex-row items-center rounded-2xl border p-4"
              style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
            >
              <View className="mr-3 h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: colors.saffron + '20' }}>
                <CalendarDays size={22} color={colors.orange} />
              </View>
              <View className="flex-1">
                <Text className="font-pbold" style={{ color: colors.text }}>पंचांग और त्योहार</Text>
                <Text className="mt-1 text-xs font-pmedium" style={{ color: colors.textLight }}>एक ही कैलेंडर में पर्वों की तारीखें देखें</Text>
              </View>
              <Text className="text-xl font-pbold" style={{ color: colors.orange }}>›</Text>
            </Pressable>

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
                {featuredDevotion && (
                  <FeaturedDevotionCard
                    item={featuredDevotion}
                    colors={colors}
                    onPress={openDetail}
                  />
                )}
                <View className="px-4 flex-col flex-wrap justify-between">
                  {otherDevotions.map((item) => (
                    <View key={item.id} className="w-full mb-1">
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
