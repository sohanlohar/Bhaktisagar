import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../screens/HomeScreen';
import CategoryScreen from '../../screens/CategoryScreen';
import SubcategoryScreen from '../../screens/SubcategoryScreen';
import DetailListScreen from '../../screens/DetailListScreen';

const Stack = createNativeStackNavigator();
export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Bhakti Sagar' }}
      />
      <Stack.Screen
        name="Category"
        component={CategoryScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
      <Stack.Screen
        name="Subcategory"
        component={SubcategoryScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
      <Stack.Screen
        name="DetailList"
        component={DetailListScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
    </Stack.Navigator>
  );
}
