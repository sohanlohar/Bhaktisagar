import React, { memo, useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../../screens/HomeScreen';
import BrowseCategoryScreen from '../../screens/BrowseCategoryScreen';
import CategoryScreen from '../../screens/CategoryScreen';
import SubcategoryScreen from '../../screens/SubcategoryScreen';
import DetailListScreen from '../../screens/DetailListScreen';

const Stack = createNativeStackNavigator();

function HomeStack() {
  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      animation: 'slide_from_right',
      freezeOnBlur: true,
    }),
    [],
  );

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Home" component={HomeScreen} />

      <Stack.Screen name="BrowseCategory" component={BrowseCategoryScreen} />

      <Stack.Screen name="Category" component={CategoryScreen} />

      <Stack.Screen name="Subcategory" component={SubcategoryScreen} />

      <Stack.Screen name="DetailList" component={DetailListScreen} />
    </Stack.Navigator>
  );
}

export default memo(HomeStack);
