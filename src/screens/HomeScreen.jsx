import React from 'react';
import { View, ScrollView, FlatList, Text, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { BhaktiHeader, SpecialTicker } from '../components/home/BhaktiHeader';
import { IconTile } from '../components/IconTile';
import CategoryPill from '../components/CategoryPill';
import { GridListItem, SubCategoryChip } from '../components/home/HomeComponents';
import { Search, Music, Zap, Star, Flame, Sun, Ghost, ScrollText, Heart } from 'lucide-react-native';

const HOME_CATEGORIES = [
  { id: '1', title: 'मंत्र', icon: '🙏' },
  { id: '2', title: 'चालीसा', icon: '🎶' },
  { id: '3', title: 'फोटो स्टोरीज', icon: '🖼️' },
  { id: '4', title: 'चलचित्र', icon: '📽️', isNew: true },
  { id: '5', title: 'भक्तमाल', icon: '💃' },
  { id: '6', title: 'शुभकामनाएं', icon: '🎉' },
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
      <Text className="text-2xl font-bold" style={{ color: colors.orange || '#E65100' }}>
        {title} <Text style={{ fontSize: 20 }}>›</Text>
      </Text>
    </View>
  );
};

export default function HomeScreen() {
  const nav = useNavigation();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.gold || '#FDCB02' }} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.gold || '#FDCB02'} />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <BhaktiHeader />
        <SpecialTicker />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Categories */}
          <View className="mt-8">
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
                  onPress={() => { }}
                />
              )}
            />
          </View>

          {/* Quick Pills */}
          <View className="mt-10 flex-row justify-center px-4 flex-wrap">
            <CategoryPill label="तिथि" color="#F8DE7E" />
            <CategoryPill label="राशिफल" color="#B01C04" />
            <CategoryPill label="राहुकाल" color="#1B4D3E" />
            <CategoryPill label="पंचांग" color="#B01C04" />
          </View>

          {/* Bhajan Section */}
          <SectionHeader title="भजन" />
          <View className="px-3 flex-row flex-wrap">
            {BHAJANS.map(item => (
              <View key={item.id} style={{ width: '50%' }}>
                <GridListItem title={item.title} icon={Music} color="#D81B60" />
              </View>
            ))}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4 px-4 overflow-visible">
            <SubCategoryChip label="शिव भजन" icon={Flame} />
            <SubCategoryChip label="राम भजन" icon={Zap} />
            <SubCategoryChip label="कृष्ण भजन" icon={Heart} />
          </ScrollView>

          {/* Aarti Section */}
          <SectionHeader title="आरती" />
          <View className="px-3 flex-row flex-wrap">
            {AARTIS.map(item => (
              <View key={item.id} style={{ width: '50%' }}>
                <GridListItem title={item.title} icon={Zap} color="#FF9100" />
              </View>
            ))}
          </View>

          {/* Festivals Section */}
          <SectionHeader title="आगामी त्योहार" />
          <View className="px-3 flex-row flex-wrap">
            <View style={{ width: '50%' }}><GridListItem title="फाल्गुन कृष्ण जन्माष्टमी" icon={Star} color="#4CAF50" /></View>
            <View style={{ width: '50%' }}><GridListItem title="फाल्गुन कालाष्टमी व्रत" icon={Ghost} color="#333" /></View>
            <View style={{ width: '50%' }}><GridListItem title="भद्रा" icon={ScrollText} color="#795548" /></View>
            <View style={{ width: '50%' }}><GridListItem title="दयानंद सरस्वती जयंती" icon={Flame} color="#FF5722" /></View>
            <View style={{ width: '50%' }}><GridListItem title="कुम्भ संक्रान्ति" icon={Sun} color="#FFC107" /></View>
            <View style={{ width: '50%' }}><GridListItem title="विजया एकादशी" icon={Star} color="#9C27B0" /></View>
          </View>
        </ScrollView>
      </View>

      <Pressable
        className="absolute bottom-24 right-4 w-12 h-12 rounded-full items-center justify-center shadow-lg"
        style={{ backgroundColor: '#FDCB02', elevation: 8 }}
      >
        <Search size={28} color="#B01C04" />
      </Pressable>
    </SafeAreaView>
  );
}
