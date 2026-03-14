import React, { memo, useMemo } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

function BhaktiLoader({ message = 'लोड हो रहा है...', fullScreen = true }) {
  const { colors } = useTheme();

  const containerStyle = useMemo(
    () => [
      fullScreen ? styles.fullContainer : styles.inlineContainer,
      { backgroundColor: colors.background },
    ],
    [colors.background, fullScreen],
  );

  const textColor = colors.textLight || '#666';
  const loaderColor = colors.saffron || '#FF9933';

  return (
    <View style={containerStyle}>
      <View style={styles.center}>
        <ActivityIndicator size="large" color={loaderColor} />

        {message ? (
          <Text style={[styles.text, { color: textColor }]}>{message}</Text>
        ) : null}
      </View>
    </View>
  );
}

export default memo(BhaktiLoader);

const styles = StyleSheet.create({
  fullContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },

  inlineContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },

  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
  },
});
