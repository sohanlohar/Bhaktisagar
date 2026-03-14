import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function BhaktiLoader({ message = 'लोड हो रहा है...' }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.saffron || '#FF9933'} />
        {message && (
          <Text 
            className="mt-4 text-sm font-bold" 
            style={{ color: colors.textLight || '#666' }}
          >
            {message}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});
