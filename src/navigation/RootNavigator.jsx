import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './home/HomeStack';
import BookmarksScreen from '../screens/BookmarkScreen';
import PanchangScreen from '../screens/PanchangScreen';
import WeatherScreen from '../screens/WeatherScreen';
import { Home, Bookmark, CalendarDays, CloudSun } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

const renderIcon =
  IconComponent =>
    ({ color, size }) =>
      <IconComponent color={color} size={size} />;

const RootNavigator = () => {
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
        name="HomeTab"
        component={HomeStack}
        options={{
          title: 'Home',
          tabBarIcon: renderIcon(Home),
        }}
      />
      <Tab.Screen
        name="Bookmarks"
        component={BookmarksScreen}
        options={{
          title: 'Bookmarks',
          tabBarIcon: renderIcon(Bookmark),
        }}
      />
      <Tab.Screen
        name="Panchang"
        component={PanchangScreen}
        options={{
          title: 'Panchang',
          tabBarIcon: renderIcon(CalendarDays),
        }}
      />
      <Tab.Screen
        name="Weather"
        component={WeatherScreen}
        options={{
          title: 'Weather',
          tabBarIcon: renderIcon(CloudSun),
        }}
      />
    </Tab.Navigator>
  );
};

export default RootNavigator;
