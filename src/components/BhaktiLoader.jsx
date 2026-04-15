import React, { memo } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';

function BhaktiLoader({ message = 'लोड हो रहा है...', fullScreen = true }) {
  const { colors } = useTheme();

  const textColor = colors.textLight || '#666';
  const loaderColor = colors.saffron || '#FF9933';

  return (
    <View
      style={{
        ...(fullScreen
          ? {
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 999,
            }
          : { paddingVertical: 40 }),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
      }}
    >
      <View className="items-center justify-center">
        <ActivityIndicator size="large" color={loaderColor} />

        {message ? (
          <Text className="mt-4 text-sm font-psemibold" style={{ color: textColor }}>{message}</Text>
        ) : null}
      </View>
    </View>
  );
}

export default memo(BhaktiLoader);
