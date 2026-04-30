import React, { memo, useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../../screens/HomeScreen';
import BrowseCategoryScreen from '../../screens/BrowseCategoryScreen';
import { ROUTES } from '../../constants';

const Stack = createNativeStackNavigator();

function HomeStack() {
  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      animation: 'ios',
      freezeOnBlur: true,
    }),
    [],
  );

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name={ROUTES.BROWSE_CATEGORY} component={BrowseCategoryScreen} />
    </Stack.Navigator>
  );
}

export default memo(HomeStack);
