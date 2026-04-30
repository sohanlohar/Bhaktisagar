import React, { memo, useCallback } from 'react';
import { Image, Pressable, Text, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Heart, Search, Settings } from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

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
      style={[
        styles.headerContainer,
        {
          minHeight: APP_LAYOUT.headerHeight,
          backgroundColor: colors.headerBg,
        },
      ]}
    >
      <View style={StyleSheet.absoluteFill}>
        <Svg height="100%" width="100%">
          <Defs>
            <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#FF9933" stopOpacity="1" />
              <Stop offset="50%" stopColor="#FF7F11" stopOpacity="1" />
              <Stop offset="100%" stopColor="#FDCB02" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
        </Svg>
      </View>

      <View
        className="flex-row items-center justify-between px-4"
        style={{ flex: 1, paddingHorizontal: APP_LAYOUT.headerHorizontalPadding }}
      >
        <View className="flex-row items-center">
          <View style={styles.logoWrapper}>
            <Image
              source={require('../../assets/app_icon.webp')}
              style={styles.logo}
            />
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          <Pressable
            style={styles.iconButton}
            onPress={openBookmarks}
            hitSlop={12}
          >
            <Heart size={24} color={colors.headerText || 'white'} />
            {bookmarks.length > 0 && (
              <View style={styles.badge}>
                <Text style={[styles.badgeText, { color: colors.text }]}>
                  {bookmarkCountText}
                </Text>
              </View>
            )}
          </Pressable>

          <Pressable style={styles.iconButton} onPress={openSearch} hitSlop={12}>
            <Search size={24} color={colors.headerText || 'white'} />
          </Pressable>

          <Pressable style={styles.iconButton} onPress={openSettings} hitSlop={12}>
            <Settings size={24} color={colors.headerText || 'white'} />
          </Pressable>
        </View>
      </View>
    </View>
  );
});

export const SpecialTicker = memo(function SpecialTicker() {
  const { colors } = useTheme();
  const orange = colors.orange || '#E65100';

  return (
    <View
      className="flex-row items-center h-12"
      style={{
        backgroundColor: colors.cardBg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border + '50',
      }}
    >
      <View
        className="h-full px-4 items-center justify-center"
        style={{
          backgroundColor: orange,
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        <Text className="text-white text-[11px] font-pbold text-center leading-4">
          आज का{'\n'}विशेष
        </Text>
      </View>
      <View className="flex-1 px-4">
        <Text className="text-sm font-pmedium" numberOfLines={1} style={{ color: colors.text }}>
          <Text style={{ color: orange, fontWeight: '700' }}>विष्णु भजन</Text>
          <Text style={{ color: colors.textLight }}> | </Text>
          <Text>तुने मुझे बुलाया शेरा वालिए</Text>
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  headerContainer: {
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  logoWrapper: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 2,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  logo: {
    width: 38,
    height: 38,
    borderRadius: 19,
    resizeMode: 'contain',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  badgeText: {
    fontSize: 8,
    fontFamily: 'Poppins-Bold',
  },
});
