import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import BhaktiLoader from '../components/BhaktiLoader';
import ScreenWrapper from '../components/ScreenWrapper';
import { useTheme } from '../context/ThemeContext';

const SUBS = [
  { id: 'hanuman', title: 'हनुमान', icon: '🙏' },
  { id: 'shiv', title: 'शिव', icon: '🕉️' },
  { id: 'krishna', title: 'कृष्ण', icon: '🪈' },
  { id: 'durga', title: 'दुर्गा', icon: '🔱' },
];

export default function CategoryScreen() {
  const nav = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();
  const { kind, title } = route.params;
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [kind]);

  if (loading) {
    return (
      <ScreenWrapper>
        <View className="flex-row items-center px-5 py-4" style={{ backgroundColor: colors.headerBg }}>
          <Pressable onPress={() => nav.goBack()} className="mr-3">
            <ChevronLeft color={colors.headerText} size={28} />
          </Pressable>
          <Text className="text-3xl font-bold" style={{ color: colors.headerText }}>{title}</Text>
        </View>
        <BhaktiLoader message={`${title} की श्रेणियां...`} />
      </ScreenWrapper>
    );
  }

  const renderItem = React.useCallback(({ item }) => (
    <Pressable
      onPress={() =>
        nav.navigate('Subcategory', {
          kind,
          subId: item.id,
          title: `${item.title} ${title}`,
        })
      }
      className="flex-1 m-2 p-6 rounded-[32px] border items-center shadow-sm"
      style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
    >
      <View className="w-16 h-16 rounded-2xl bg-saffron/10 items-center justify-center mb-4" style={{ backgroundColor: colors.saffron + '15' }}>
        <Text className="text-3xl">{item.icon}</Text>
      </View>
      <Text className="text-[16px] font-bold text-center" style={{ color: colors.text }}>{item.title}</Text>
    </Pressable>
  ), [nav, kind, title, colors]);

  return (
    <ScreenWrapper>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View className="flex-row items-center px-5 py-4" style={{ backgroundColor: colors.headerBg }}>
          <Pressable onPress={() => nav.goBack()} className="mr-3">
            <ChevronLeft color={colors.headerText} size={28} />
          </Pressable>
          <Text className="text-3xl font-bold" style={{ color: colors.headerText }}>{title}</Text>
          <Text className="text-[14px] mt-1" style={{ color: colors.headerText, opacity: 0.8 }}>वर्ग चुनें</Text>
        </View>
        <FlatList
          data={SUBS}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 20 }}
          renderItem={renderItem}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews={false} // False for small grid to not mess up styling
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenWrapper>
  );
}
