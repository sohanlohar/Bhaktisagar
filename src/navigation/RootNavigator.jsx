import React, { useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home, CalendarDays, Heart } from 'lucide-react-native';

import { useTheme } from '../context/ThemeContext';
import { ROUTES } from '../constants';

/* ---------- Screens (static imports for navigation stability) ---------- */
import HomeStack from './home/HomeStack';
import BookmarksScreen from '../screens/BookmarkScreen';
import PanchangScreen from '../screens/PanchangScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SearchScreen from '../screens/SearchScreen';
import ContentDetailScreen from '../screens/ContentDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/* ---------- Icon Renderer ---------- */

const renderIcon = Icon =>
  ({ color, size }) =>
    <Icon color={color} size={size} />;

/* ---------- Tabs ---------- */

const MainTabs = React.memo(() => {

  const { colors } = useTheme();

  const screenOptions = useMemo(() => ({
    headerShown: false,
    lazy: true,
    freezeOnBlur: true,
    tabBarActiveTintColor: colors.tabBarActive,
    tabBarInactiveTintColor: colors.tabBarInactive,
    tabBarStyle: {
      height: 80,
      paddingBottom: 10,
      paddingTop: 5,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border
    },
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: '600',
    }

  }), [colors]);

  return (

    <Tab.Navigator screenOptions={screenOptions}>

      <Tab.Screen
        name={ROUTES.HOME_TAB}
        component={HomeStack}
        options={{
          title: 'मुख्य',
          tabBarIcon: renderIcon(Home)
        }}
      />

      <Tab.Screen
        name={ROUTES.BOOKMARKS}
        component={BookmarksScreen}
        options={{
          title: 'संग्रह',
          tabBarIcon: renderIcon(Heart),
          // Pre-mount so first tab press is instant.
          lazy: false,
        }}
      />

      <Tab.Screen
        name={ROUTES.PANCHANG}
        component={PanchangScreen}
        options={{
          title: 'पंचांग',
          tabBarIcon: renderIcon(CalendarDays),
          // Pre-mount so first tab press is instant.
          lazy: false,
        }}
      />

    </Tab.Navigator>
  );
});

/* ---------- Root Stack ---------- */

const RootNavigator = () => {

  const stackOptions = useMemo(() => ({
    headerShown: false
  }), []);

  return (

    <Stack.Navigator screenOptions={stackOptions}>

      <Stack.Screen
        name={ROUTES.ROOT_TABS}
        component={MainTabs}
      />

      <Stack.Screen
        name={ROUTES.SETTINGS}
        component={ProfileScreen}
      />

      <Stack.Screen
        name={ROUTES.SEARCH}
        component={SearchScreen}
      />

      <Stack.Screen
        name={ROUTES.DETAIL}
        component={ContentDetailScreen}
      />

    </Stack.Navigator>

  );
};

export default RootNavigator;