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

  const circleStyle = useMemo(
    () => ({
      borderColor: colors.orange + '44',
    }),
    [colors.orange],
  );

  const squareStyle = useMemo(
    () => ({
      borderColor: colors.orange,
    }),
    [colors.orange],
  );

  return (
    <AnimatedPressable onPress={onPress} style={styles.container}>
      <View style={styles.iconWrapper}>
        <View style={styles.mandala}>
          <View style={[styles.baseCircle, circleStyle]} />

          <View
            style={[
              styles.square,
              squareStyle,
              { transform: [{ rotate: '0deg' }] },
            ]}
          />

          <View
            style={[
              styles.square,
              squareStyle,
              { transform: [{ rotate: '45deg' }] },
            ]}
          />

          <View style={styles.iconContainer}>
            <Text style={[styles.iconText, { color: colors.orange }]}>
              {icon}
            </Text>
          </View>
        </View>

        {isNew && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>NEW</Text>
          </View>
        )}
      </View>

      <Text numberOfLines={1} style={[styles.label, { color: colors.text }]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 8,
    flex: 1,
    width: 80,
  },

  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  mandala: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },

  baseCircle: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 999,
  },

  square: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderWidth: 2,
    borderRadius: 10,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconText: {
    fontSize: 20,
  },

  label: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },

  badge: {
    position: 'absolute',
    top: -4,
    right: 0,
    backgroundColor: '#16A34A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  badgeText: {
    fontSize: 7,
    fontWeight: '700',
    color: '#fff',
  },
});
