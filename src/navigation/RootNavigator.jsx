import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeStack from './home/HomeStack';
import BookmarksScreen from '../screens/BookmarkScreen';
import PanchangScreen from '../screens/PanchangScreen';
import WeatherScreen from '../screens/WeatherScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Home, Bookmark, CalendarDays, CloudSun } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { ROUTES } from '../constants';

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
          marginBottom: 10,
        },
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
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
          title: 'Bookmarks',
          tabBarIcon: renderIcon(Bookmark),
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
      <Tab.Screen
        name={ROUTES.WEATHER}
        component={WeatherScreen}
        options={{
          title: 'Weather',
          tabBarIcon: renderIcon(CloudSun),
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
    </Stack.Navigator>
  );
};

export default RootNavigator;
