import React, { useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home, CalendarDays, Heart } from 'lucide-react-native';

import { useTheme } from '../context/ThemeContext';
import { ROUTES } from '../constants';

/* ---------- Lazy Screens ---------- */

const HomeStack = React.lazy(() => import('./home/HomeStack'));
const BookmarksScreen = React.lazy(() => import('../screens/BookmarkScreen'));
const PanchangScreen = React.lazy(() => import('../screens/PanchangScreen'));
const ProfileScreen = React.lazy(() => import('../screens/ProfileScreen'));
const SearchScreen = React.lazy(() => import('../screens/SearchScreen'));
const ContentDetailScreen = React.lazy(() => import('../screens/ContentDetailScreen'));

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
          title: 'Home',
          tabBarIcon: renderIcon(Home)
        }}
      />

      <Tab.Screen
        name={ROUTES.BOOKMARKS}
        component={BookmarksScreen}
        options={{
          title: 'Favorites',
          tabBarIcon: renderIcon(Heart)
        }}
      />

      <Tab.Screen
        name={ROUTES.PANCHANG}
        component={PanchangScreen}
        options={{
          title: 'Panchang',
          tabBarIcon: renderIcon(CalendarDays)
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