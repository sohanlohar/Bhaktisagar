import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './home/HomeStack';
import BookmarksScreen from '../screens/BookmarkScreen';
import PanchangScreen from '../screens/PanchangScreen';
import WeatherScreen from '../screens/WeatherScreen';
import { Home, Bookmark, CalendarDays, CloudSun } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

const renderIcon =
  IconComponent =>
  ({ color, size }) =>
    <IconComponent color={color} size={size} />;

const RootNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#B22222',
        tabBarInactiveTintColor: '#777',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarStyle: {
          height: 70,
          paddingBottom: 5,
          backgroundColor: '#FFF9F5',
          borderTopWidth: 0.5,
          borderTopColor: '#ddd',
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
