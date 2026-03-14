import React from 'react';
import { View, ScrollView, FlatList, Text, Pressable } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { SpecialTicker } from '../components/home/BhaktiHeader';
import { IconTile } from '../components/IconTile';
import CategoryPill from '../components/CategoryPill';
import { GridListItem, SubCategoryChip } from '../components/home/HomeComponents';
import ItemCard from '../components/ItemCard';
import { Music, Star, ScrollText, Heart, Sparkles, Zap } from 'lucide-react-native';
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
  // { id: '5', title: 'फोटो स्टोरीज', icon: '🖼️' },
  // { id: '6', title: 'चलचित्र', icon: '📽️', isNew: true },
];

/**
 * Get icon component based on content kind
 */
const getKindIcon = (kind) => {
  switch (kind) {
    case 'mantra':
      return Sparkles;
    case 'chalisa':
      return ScrollText;
    case 'bhajan':
      return Music;
    case 'aarti':
      return Zap;
    default:
      return Star;
  }
};

/**
 * Get icon color based on content kind
 */
const getKindColor = (kind, colors) => {
  switch (kind) {
    case 'mantra':
      return colors.primary;
    case 'chalisa':
      return colors.saffron;
    case 'bhajan':
      return colors.orange;
    case 'aarti':
      return colors.gold || colors.saffron;
    default:
      return colors.text;
  }
};

const SectionHeader = ({ title }) => {
  const { colors } = useTheme();
  return (
    <View className="items-center mt-8 mb-6">
      <Text className="text-2xl font-bold" style={{ color: colors.orange }}>
        {title} <Text style={{ fontSize: 20 }}>›</Text>
      </Text>
    </View>
  );
};

export default function HomeScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [panchang, setPanchang] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [homeContent, setHomeContent] = React.useState({
    todaysDevotion: [],
    dailyPicks: [],
    trending: [],
  });

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const panchangData = await getTodayPanchang();
        setPanchang(panchangData);
        // Load dynamic home content
        const content = getHomePageContent();
        setHomeContent(content);
      } catch (error) {
        console.error("Error loading home data:", error);
      } finally {
        // Add a tiny delay for smoother transition
        setTimeout(() => setLoading(false), 300);
      }
    })();
  }, []);

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
        {/* <SpecialTicker /> */}

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Categories */}
          <View className="mt-2">
            <FlatList
              data={HOME_CATEGORIES}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingHorizontal: 10 }}
              renderItem={({ item }) => (
                <IconTile
                  icon={item.icon}
                  label={item.title}
                  isNew={item.isNew}
                  onPress={() => {
                    if (item.kind) {
                      navigation.navigate(ROUTES.BROWSE_CATEGORY || 'BrowseCategory', {
                        kind: item.kind,
                        title: item.title,
                      });
                    }
                  }}
                />
              )}
            />
          </View>

          {/* Quick Pills */}
          <SectionHeader title="आज का पंचांग" />
          {panchang ? (
            <PanchangSection panchang={panchang} />
          ) : (
            <View className="mt-4 flex-row justify-center px-4 flex-wrap">
              <CategoryPill label="तिथि" color={colors.pillYellow} />
              <CategoryPill label="राशिफल" color={colors.pillRed} />
              <CategoryPill label="राहुकाल" color={colors.pillDarkGreen} />
              <CategoryPill label="पंचांग" color={colors.pillRed} />
            </View>
          )}

          {/* Today's Devotion Section */}
          {homeContent.todaysDevotion.length > 0 && (
            <>
              <SectionHeader title="आज की भक्ति" />
              <View className="px-4 flex-row flex-wrap justify-between">
                {homeContent.todaysDevotion.map((item) => (
                  <View key={item.id} style={{ width: '48%', marginBottom: 12 }}>
                    <ItemCard
                      id={item.id}
                      title={item.title}
                      item={item}
                      onPress={() =>
                        navigation.navigate('Detail', {
                          item: { ...item, kind: item.kind },
                        })
                      }
                    />
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Daily Picks Section */}
          {homeContent.dailyPicks.length > 0 && (
            <>
              <SectionHeader title="दैनिक चयन" />
              <View className="px-3 flex-row flex-wrap">
                {homeContent.dailyPicks.map(item => (
                  <View key={item.id} style={{ width: '50%' }}>
                    <GridListItem
                      title={item.title}
                      icon={getKindIcon(item.kind)}
                      color={getKindColor(item.kind, colors)}
                      onPress={() =>
                        navigation.navigate('Detail', {
                          item: { ...item, kind: item.kind },
                        })
                      }
                    />
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Trending Section */}
          {homeContent.trending.length > 0 && (
            <>
              <SectionHeader title="लोकप्रिय" />
              <View className="px-4">
                <FlatList
                  data={homeContent.trending}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={{ paddingVertical: 8 }}
                  renderItem={({ item }) => (
                    <View style={{ width: 280, marginRight: 12 }}>
                      <ItemCard
                        id={item.id}
                        title={item.title}
                        item={item}
                        onPress={() =>
                          navigation.navigate('Detail', {
                            item: { ...item, kind: item.kind },
                          })
                        }
                      />
                    </View>
                  )}
                />
              </View>
            </>
          )}

          {/* Festivals Section */}
          {/* <SectionHeader title="आगामी त्योहार" />
          <View className="px-3 flex-row flex-wrap">
            <View style={{ width: '50%' }}><GridListItem title="फाल्गुन कृष्ण जन्माष्टमी" icon={Star} color={colors.pillGreen} /></View>
            <View style={{ width: '50%' }}><GridListItem title="फाल्गुन कालाष्टमी व्रत" icon={Ghost} color={colors.text} /></View>
            <View style={{ width: '50%' }}><GridListItem title="भद्रा" icon={ScrollText} color={colors.textLight} /></View>
            <View style={{ width: '50%' }}><GridListItem title="दयानंद सरस्वती जयंती" icon={Flame} color={colors.orange} /></View>
            <View style={{ width: '50%' }}><GridListItem title="कुम्भ संक्रान्ति" icon={Sun} color={colors.gold} /></View>
            <View style={{ width: '50%' }}><GridListItem title="विजया एकादशी" icon={Star} color={colors.primary} /></View>
          </View> */}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}
