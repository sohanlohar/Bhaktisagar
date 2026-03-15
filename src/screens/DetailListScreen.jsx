import React from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ChevronLeft, Heart } from 'lucide-react-native';

import { useTheme } from '../context/ThemeContext';
import { useBookmarks } from '../hooks/useBookmarks';

export default function DetailListScreen() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const item = params?.item;
  const title = params?.title || item?.title || 'Bhakti';

  const content =
    item?.content ||
    item?.lyrics ||
    'सामग्री शीघ्र ही उपलब्ध होगी।';

  const { bookmarked, toggle } = useBookmarks(
    item?.id,
    item?.title
  );

  return (
    <ScreenWrapper>

      <View style={{ flex: 1, backgroundColor: colors.background }}>

        {/* Header */}

        <View
          className="flex-row items-center justify-between px-4 py-3"
          style={{ backgroundColor: colors.headerBg }}
        >

          <View className="flex-row items-center">

            <Pressable
              onPress={() => navigation.goBack()}
              className="mr-3"
            >
              <ChevronLeft
                color={colors.headerText || colors.text}
                size={28}
              />
            </Pressable>

            <Text
              className="text-xl font-bold"
              style={{ color: colors.headerText || colors.text }}
            >
              {title}
            </Text>

          </View>

          {item && (

            <Pressable
              onPress={toggle}
              className="p-2"
            >

              <Heart
                color={
                  bookmarked
                    ? colors.saffron
                    : colors.headerText || colors.text
                }
                fill={bookmarked ? colors.saffron : 'none'}
                size={24}
              />

            </Pressable>

          )}

        </View>

        {/* Content */}

        <ScrollView
          className="flex-1 p-6"
          showsVerticalScrollIndicator={false}
        >

          <Text
            style={{
              fontSize: 18,
              lineHeight: 32,
              color: colors.text,
              textAlign: 'center',
            }}
          >
            {content}
          </Text>

        </ScrollView>

      </View>

    </ScreenWrapper>
  );
}