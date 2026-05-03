import React, { memo, useMemo } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import AnimatedPressable from './AnimatedPressable';

export const IconTile = memo(function IconTile({
  icon,
  label,
  onPress,
  isNew,
}) {
  const { colors } = useTheme();

  const containerStyle = useMemo(() => ({
    backgroundColor: colors.cardBg,
    borderColor: colors.orange + '30',
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  }), [colors.cardBg, colors.orange]);

  return (
    <View className="flex-row flex-wrap justify-between px-3">
      <AnimatedPressable
        onPress={onPress}
        className="items-center flex-1"
      >
        <View style={styles.contentWrapper}>
          <View
            style={[styles.tileContainer, containerStyle]}
            className="w-16 h-16 rounded-2xl items-center justify-center border"
          >
            {/* Decorative Background Circles */}
            <View
              style={[styles.bgCircle, { backgroundColor: colors.orange + '10' }]}
              className="absolute w-12 h-12"
            />

            <Text className="text-2xl">{icon}</Text>
          </View>

          {isNew && (
            <View
              className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-lg"
              style={styles.newBadge}
            >
              <Text className="text-[8px] font-pbold text-white uppercase tracking-tighter">New</Text>
            </View>
          )}
        </View>

        <Text
          numberOfLines={1}
          className="mt-2 text-[12px] font-pbold text-center"
          style={{ color: colors.text }}
        >
          {label}
        </Text>
      </AnimatedPressable>
    </View>
  );
});

const styles = StyleSheet.create({
  contentWrapper: {
    paddingTop: 8,
  },
  tileContainer: {
    overflow: 'hidden',
  },
  bgCircle: {
    transform: [{ scale: 1.2 }],
    opacity: 0.5,
  },
  newBadge: {
    backgroundColor: '#16A34A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 10,
  },
});
