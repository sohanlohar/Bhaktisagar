import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeStack from './home/HomeStack';
import BookmarksScreen from '../screens/BookmarkScreen';
import PanchangScreen from '../screens/PanchangScreen';
import WeatherScreen from '../screens/WeatherScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SearchScreen from '../screens/SearchScreen';
import ContentDetailScreen from '../screens/ContentDetailScreen';
import { Home, Bookmark, CalendarDays, CloudSun, Heart } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { ROUTES } from '../constants';
import { BhaktiHeader } from '../components/home/BhaktiHeader';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const renderIcon =
  IconComponent =>
    ({ color, size }) =>
      <IconComponent color={color} size={size} />;

const MainTabs = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 20,
        },
        tabBarStyle: {
          height: 80,
          paddingBottom: 10,
          paddingTop: 5,
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tab.Screen
        name={ROUTES.HOME_TAB}
        component={HomeStack}
        options={{
          title: 'Home',
          tabBarIcon: renderIcon(Home),
        }}
      />
      <Tab.Screen
        name={ROUTES.BOOKMARKS}
        component={BookmarksScreen}
        options={{
          title: 'Favorites',
          tabBarIcon: renderIcon(Heart),
        }}
      />
      <Tab.Screen
        name={ROUTES.PANCHANG}
        component={PanchangScreen}
        options={{
          title: 'Panchang',
          tabBarIcon: renderIcon(CalendarDays),
        }}
      />
    </Tab.Navigator>
  );
};

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
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
