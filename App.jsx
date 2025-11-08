import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { BookmarkProvider } from './src/context/BookmarkContext';
import { StatusBar } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#FFF9F5' },
};

export default function App() {
  return (
    <BookmarkProvider>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer theme={navTheme}>
        <RootNavigator />
      </NavigationContainer>
    </BookmarkProvider>
  );
}
