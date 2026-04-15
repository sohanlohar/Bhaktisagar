import React, { memo, useCallback, useMemo } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Heart, Search, Settings } from 'lucide-react-native';

import { ROUTES } from '../../constants';
import { useTheme } from '../../context/ThemeContext';
import { useBookmarks } from '../../hooks/useBookmarks';
import { APP_LAYOUT } from '../../theme/layout';

export const BhaktiHeader = memo(function BhaktiHeader() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { bookmarks } = useBookmarks();

  const openBookmarks = useCallback(() => {
    navigation.navigate(ROUTES.ROOT_TABS, { screen: ROUTES.BOOKMARKS });
  }, [navigation]);

  const openSearch = useCallback(() => {
    navigation.navigate(ROUTES.SEARCH);
  }, [navigation]);

  const openSettings = useCallback(() => {
    navigation.navigate(ROUTES.SETTINGS);
  }, [navigation]);

  const bookmarkCountText = bookmarks.length > 99 ? '99+' : String(bookmarks.length);

  return (
    <View
      className="flex-row items-center justify-between px-4 py-2"
      style={{
        backgroundColor: colors.headerBg,
        minHeight: APP_LAYOUT.headerHeight,
        paddingHorizontal: APP_LAYOUT.headerHorizontalPadding,
      }}
    >
      <View className="flex-row items-center">
        <View className="rounded-full items-center justify-center shadow-sm">
          <Image
            source={require('../../assets/app_icon.webp')}
            className="rounded-full"
            style={{
              width: 40,
              height: 40,
              resizeMode: 'contain',
            }}
          />
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        <Pressable
          className="flex-row items-center justify-center w-9 h-9 rounded-full"
          onPress={openBookmarks}
          hitSlop={8}
        >
          <Heart size={25} color={colors.headerText || 'white'} />
          {bookmarks.length > 0 && (
            <View className="absolute -top-1 -right-1 bg-white rounded-full min-w-[16px] h-4 px-0.5 items-center justify-center border border-gray-100">
              <Text
                className="text-[8px] font-pbold"
                style={{ color: colors.text }}
              >
                {bookmarkCountText}
              </Text>
            </View>
          )}
        </Pressable>

        <Pressable className="items-center justify-center w-9 h-9 rounded-full ml-1" onPress={openSearch} hitSlop={8}>
          <Search size={25} color={colors.headerText || 'white'} />
        </Pressable>

        <Pressable className="items-center justify-center w-9 h-9 rounded-full ml-1" onPress={openSettings} hitSlop={8}>
          <Settings size={25} color={colors.headerText || 'white'} />
        </Pressable>
      </View>
    </View>
  );
});

export const SpecialTicker = memo(function SpecialTicker() {
  const { colors } = useTheme();
  const orange = colors.orange || '#E65100';

  return (
    <View className="flex-row items-center bg-white border-b border-gray-100 h-10">
      <View
        className="h-full px-3 items-center justify-center"
        style={{ backgroundColor: orange }}
      >
        <Text className="text-white text-[12px] font-pbold text-center leading-4">
          {' '}
          आज का{'\n'}विशेष{' '}
        </Text>
      </View>
      <View className="flex-1 px-4">
        <Text className="text-sm font-pmedium" numberOfLines={1}>
          <Text style={{ color: orange }}>{' '}विष्णु भजन{' '}</Text>
          <Text style={{ color: '#999' }}> | </Text>
          <Text style={{ color: orange }}>
            {' '}
            भजन: तुने मुझे बुलाया शेरा वालिए{' '}
          </Text>
        </Text>
      </View>
    </View>
  );
});
