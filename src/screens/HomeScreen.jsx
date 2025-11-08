import React from 'react';
import { View, ScrollView, FlatList, Text } from 'react-native';
import CategoryPill from '../components/CategoryPill';
import { IconTile } from '../components/IconTile';
import SectionHeader from '../components/SectionHeader';
import ItemCard from '../components/ItemCard';
import { CATEGORIES } from '../data/categories';
import { aartiTiles, bhajanTiles, festivalTiles } from '../data/homeSections';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const nav = useNavigation();

  return (
    <ScrollView
      contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 20 }}
    >
      {/* Top horizontal pills */}

      <FlatList
        data={['तिथि', 'राशिफल', 'राहुकाल', 'विचार', 'पंचांग']}
        horizontal
        keyExtractor={i => i}
        showsHorizontalScrollIndicator={false}
        className="px-3 mt-3"
        contentContainerStyle={{ gap: 10 }}
        removeClippedSubviews={false}
        renderItem={({ item }) => (
          <CategoryPill label={item} onPress={() => nav.navigate('Panchang')} />
        )}
      />

      {/* Circular icon categories */}
      <FlatList
        data={CATEGORIES}
        horizontal
        keyExtractor={i => i.id}
        showsHorizontalScrollIndicator={false}
        className="px-10 mt-4 flex-1"
        renderItem={({ item }) => (
          <IconTile
            icon={item.icon}
            label={item.title}
            onPress={() =>
              nav.navigate('Category', { kind: item.kind, title: item.title })
            }
          />
        )}
      />

      {/* Bhajan Section */}
      <SectionHeader
        title="भजन"
        onSeeAll={() =>
          nav.navigate('Category', { kind: 'bhajan', title: 'भजन' })
        }
      />
      <View className="px-2 flex-row flex-wrap">
        {bhajanTiles.map(x => (
          <ItemCard
            key={x.id}
            id={x.id}
            title={x.title}
            onPress={() =>
              nav.navigate('DetailList', { title: x.title, items: [] })
            }
          />
        ))}
      </View>

      {/* Aarti Section */}
      <SectionHeader
        title="आरती"
        onSeeAll={() =>
          nav.navigate('Category', { kind: 'aarti', title: 'आरती' })
        }
      />
      <View className="px-2 flex-row flex-wrap">
        {aartiTiles.map(x => (
          <ItemCard
            key={x.id}
            id={x.id}
            title={x.title}
            onPress={() =>
              nav.navigate('DetailList', { title: x.title, items: [] })
            }
          />
        ))}
      </View>

      {/* Festivals */}
      <SectionHeader
        title="आगामी त्योहार"
        onSeeAll={() =>
          nav.navigate('Category', { kind: 'festival', title: 'आगामी त्योहार' })
        }
      />
      <View className="px-2 flex-row flex-wrap">
        {festivalTiles.map(x => (
          <ItemCard
            key={x.id}
            id={x.id}
            title={x.title}
            onPress={() =>
              nav.navigate('DetailList', { title: x.title, items: [] })
            }
          />
        ))}
      </View>
    </ScrollView>
  );
}
