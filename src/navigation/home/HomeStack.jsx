import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../screens/HomeScreen';
import BrowseCategoryScreen from '../../screens/BrowseCategoryScreen';
import CategoryScreen from '../../screens/CategoryScreen';
import SubcategoryScreen from '../../screens/SubcategoryScreen';
import DetailListScreen from '../../screens/DetailListScreen';
import ContentDetailScreen from '../../screens/ContentDetailScreen';

const Stack = createNativeStackNavigator();
export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen
        name="BrowseCategory"
        component={BrowseCategoryScreen}
      />
      <Stack.Screen
        name="Category"
        component={CategoryScreen}
      />
      <Stack.Screen
        name="Subcategory"
        component={SubcategoryScreen}
      />
      <Stack.Screen
        name="DetailList"
        component={DetailListScreen}
      />
    </Stack.Navigator>
  );
}
