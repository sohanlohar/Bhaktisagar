import React, { Suspense, useMemo } from 'react';
import { View, ActivityIndicator } from 'react-native';
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

/* ---------- Loader ---------- */

const ScreenLoader = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" />
  </View>
);

/* ---------- Icon Renderer ---------- */

const renderIcon = (IconComponent) =>
  ({ color, size }) =>
    <IconComponent color={color} size={size} />;

/* ---------- Tabs ---------- */

const MainTabs = React.memo(() => {

  const { colors } = useTheme();

  const screenOptions = useMemo(() => ({
    headerShown: false,

    lazy: true,

    tabBarActiveTintColor: colors.tabBarActive,
    tabBarInactiveTintColor: colors.tabBarInactive,

    tabBarStyle: {
      height: 80,
      paddingBottom: 10,
      paddingTop: 5,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border
    }

  }), [colors]);

  return (

    <Tab.Navigator screenOptions={screenOptions}>

      <Tab.Screen
        name={ROUTES.HOME_TAB}
        options={{
          title: 'Home',
          tabBarIcon: renderIcon(Home)
        }}
      >
        {() => (
          <Suspense fallback={<ScreenLoader />}>
            <HomeStack />
          </Suspense>
        )}
      </Tab.Screen>

      <Tab.Screen
        name={ROUTES.BOOKMARKS}
        options={{
          title: 'Favorites',
          tabBarIcon: renderIcon(Heart)
        }}
      >
        {() => (
          <Suspense fallback={<ScreenLoader />}>
            <BookmarksScreen />
          </Suspense>
        )}
      </Tab.Screen>

      <Tab.Screen
        name={ROUTES.PANCHANG}
        options={{
          title: 'Panchang',
          tabBarIcon: renderIcon(CalendarDays)
        }}
      >
        {() => (
          <Suspense fallback={<ScreenLoader />}>
            <PanchangScreen />
          </Suspense>
        )}
      </Tab.Screen>

    </Tab.Navigator>
  );
});

/* ---------- Root Stack ---------- */

const RootNavigator = () => {

  const stackOptions = useMemo(() => ({
    headerShown: false
  }), []);

  return (

    <Suspense fallback={<ScreenLoader />}>

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

    </Suspense>
  );
};

export default RootNavigator;