import React from 'react';
import { View, ScrollView, FlatList, Text, Pressable } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { BhaktiHeader, SpecialTicker } from '../components/home/BhaktiHeader';
import { IconTile } from '../components/IconTile';
import CategoryPill from '../components/CategoryPill';
import { GridListItem, SubCategoryChip } from '../components/home/HomeComponents';
import { Search, Music, Zap, Star, Flame, Sun, Ghost, ScrollText, Heart, Wind, Sunrise, Sunset, Clock, Sparkles, Smile } from 'lucide-react-native';
import { getTodayPanchang } from '../services/panchangApi';

const HOME_CATEGORIES = [
  { id: '1', title: 'मंत्र', icon: '🙏', kind: 'mantra' },
  { id: '2', title: 'चालीसा', icon: '🎶', kind: 'chalisa' },
  { id: '3', title: 'भजन', icon: '🎶', kind: 'bhajan' },
  { id: '4', title: 'आरती', icon: '🪔', kind: 'aarti' },
  { id: '5', title: 'फोटो स्टोरीज', icon: '🖼️' },
  { id: '6', title: 'चलचित्र', icon: '📽️', isNew: true },
];

const BHAJANS = [
  { id: 'b1', title: 'ॐ शंकर शिव भोले उमा...' },
  { id: 'b2', title: 'आये है दिन सावन के - ...' },
  { id: 'b3', title: 'हमारे साथ श्री महाकाल...' },
  { id: 'b4', title: 'महेश वंदना: किस विधि...' },
];

const AARTIS = [
  { id: 'a1', title: 'शिव आरती - ॐ जय ...' },
  { id: 'a2', title: 'श्री राम स्तुति' },
  { id: 'a3', title: 'नृसिंह आरती ISKCON' },
  { id: 'a4', title: 'स्वामीनारायण आरती' },
];

const SectionHeader = ({ title }) => {
  const { colors } = useTheme();
  return (
    <View className="items-center mt-10 mb-6">
      <Text className="text-2xl font-bold" style={{ color: colors.orange }}>
        {title} <Text style={{ fontSize: 20 }}>›</Text>
      </Text>
    </View>
  );
};

export default function HomeScreen() {
  // const nav = useNavigation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [panchang, setPanchang] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      const data = await getTodayPanchang();
      setPanchang(data);
    })();
  }, []);

  return (
    <ScreenWrapper>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <BhaktiHeader />
        {/* <SpecialTicker /> */}

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Categories */}
          <View className="mt-6">
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
                      navigation.navigate('BrowseCategory', {
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
            <View className="px-5">
              <Pressable
                onPress={() => navigation.navigate('Panchang')}
                className="rounded-3xl p-5 border shadow-sm"
                style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
              >
                <View className="flex-row justify-between items-center mb-4">
                  <View className="flex-row gap-2 items-center">
                    <Sun size={20} color={colors.saffron} />
                    <Text className="text-lg font-bold" style={{ color: colors.text }}>
                      {panchang.tithi}
                    </Text>
                  </View>
                  <Text style={{ color: colors.textLight, fontSize: 13 }}>{panchang.date}</Text>
                </View>

                {/* Tithi & Rahukal */}
                <View className="flex-row justify-between mb-4">
                  <View className="flex-row gap-2 items-center">
                    <Wind size={16} color={colors.textLight} />
                    <Text style={{ color: colors.text }}>नक्षत्र: <Text className="font-bold" style={{ color: colors.text }}>{panchang.nakshatra}</Text></Text>
                  </View>
                  <View className="flex-row gap-2 items-center">
                    <Clock size={16} color={colors.pillRed} />
                    <Text style={{ color: colors.text }}>राहुकाल: <Text className="font-bold" style={{ color: colors.text }}>{panchang.rahukal}</Text></Text>
                  </View>
                </View>

                {/* Shubh Muhurat */}
                <View className="flex-row gap-2 items-center mb-4 rounded-2xl">
                  <Sparkles size={18} color={colors.saffron} />
                  <Text style={{ color: colors.text }}>शुभ मुहूर्त: <Text className="font-bold">{panchang.shubh_muhurat}</Text></Text>
                </View>

                <View className="flex-row justify-between pt-3 border-t" style={{ borderTopColor: colors.border + '55' }}>
                  <View className="flex-row gap-2 items-center">
                    <Sunrise size={14} color={colors.orange} />
                    <Text style={{ color: colors.textLight, fontSize: 12 }}>{panchang.sunrise}</Text>
                  </View>
                  <View className="flex-row gap-2 items-center">
                    <Sunset size={14} color={colors.orange} />
                    <Text style={{ color: colors.textLight, fontSize: 12 }}>{panchang.sunset}</Text>
                  </View>
                  <Text className="font-bold" style={{ color: colors.saffron }}>विस्तृत पंचांग ›</Text>
                </View>
              </Pressable>
            </View>
          ) : (
            <View className="mt-10 flex-row justify-center px-4 flex-wrap">
              <CategoryPill label="तिथि" color={colors.pillYellow} />
              <CategoryPill label="राशिफल" color={colors.pillRed} />
              <CategoryPill label="राहुकाल" color={colors.pillDarkGreen} />
              <CategoryPill label="पंचांग" color={colors.pillRed} />
            </View>
          )}

          {/* Bhajan Section */}
          <SectionHeader title="भजन" />
          <View className="px-3 flex-row flex-wrap">
            {BHAJANS.map(item => (
              <View key={item.id} style={{ width: '50%' }}>
                <GridListItem title={item.title} icon={Music} color={colors.primary} />
              </View>
            ))}
          </View>


          {/* Aarti Section */}
          <SectionHeader title="आरती" />
          <View className="px-3 flex-row flex-wrap">
            {AARTIS.map(item => (
              <View key={item.id} style={{ width: '50%' }}>
                <GridListItem title={item.title} icon={Zap} color={colors.saffron} />
              </View>
            ))}
          </View>

          {/* Festivals Section */}
          <SectionHeader title="आगामी त्योहार" />
          <View className="px-3 flex-row flex-wrap">
            <View style={{ width: '50%' }}><GridListItem title="फाल्गुन कृष्ण जन्माष्टमी" icon={Star} color={colors.pillGreen} /></View>
            <View style={{ width: '50%' }}><GridListItem title="फाल्गुन कालाष्टमी व्रत" icon={Ghost} color={colors.text} /></View>
            <View style={{ width: '50%' }}><GridListItem title="भद्रा" icon={ScrollText} color={colors.textLight} /></View>
            <View style={{ width: '50%' }}><GridListItem title="दयानंद सरस्वती जयंती" icon={Flame} color={colors.orange} /></View>
            <View style={{ width: '50%' }}><GridListItem title="कुम्भ संक्रान्ति" icon={Sun} color={colors.gold} /></View>
            <View style={{ width: '50%' }}><GridListItem title="विजया एकादशी" icon={Star} color={colors.primary} /></View>
          </View>
        </ScrollView>
      </View>

      <Pressable
        className="absolute bottom-24 right-4 w-12 h-12 rounded-full items-center justify-center shadow-lg"
        style={{ backgroundColor: colors.headerBg, elevation: 8 }}
      >
        <Search size={28} color={colors.headerText} />
      </Pressable>
    </ScreenWrapper>
  );
}
