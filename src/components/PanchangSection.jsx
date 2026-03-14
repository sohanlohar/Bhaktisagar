import React, { memo, useCallback, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { ROUTES } from '../constants';

import {
  Sun,
  Wind,
  Clock,
  Sparkles,
  Sunrise,
  Sunset,
  Moon,
  Activity,
} from 'lucide-react-native';

function PanchangSection({ panchang }) {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const containerStyle = useMemo(
    () => ({
      backgroundColor: colors.cardBg,
      borderColor: colors.border,
    }),
    [colors.cardBg, colors.border],
  );

  const borderTopStyle = useMemo(
    () => ({
      borderTopColor: colors.border + '55',
    }),
    [colors.border],
  );

  const openPanchang = useCallback(() => {
    navigation.navigate(ROUTES.PANCHANG);
  }, [navigation]);

  if (!panchang) return null;

  return (
    <View style={styles.wrapper}>
      <Pressable onPress={openPanchang} style={[styles.card, containerStyle]}>
        {/* Header */}

        <View style={styles.header}>
          <View style={styles.row}>
            <Sun size={20} color={colors.saffron} />

            <Text style={[styles.title, { color: colors.text }]}>
              {panchang.tithi}
            </Text>
          </View>

          <Text style={styles.dateText}>
            {panchang.dayName}वार - {panchang.date}
          </Text>
        </View>

        {/* Nakshatra */}

        <View style={styles.rowSpacing}>
          <View style={styles.row}>
            <Wind size={16} color={colors.textLight} />

            <Text style={[styles.text, { color: colors.text }]}>
              नक्षत्र: {panchang.nakshatra}
            </Text>
          </View>
        </View>

        {/* Rahukal */}

        <View style={styles.column}>
          <View style={styles.rowSpacing}>
            <Clock size={16} color={colors.pillRed} />

            <Text style={[styles.text, { color: colors.text }]}>
              राहुकाल: {panchang.rahukal}
            </Text>
          </View>

          <View style={styles.rowSpacing}>
            <Sparkles size={16} color={colors.saffron} />

            <Text style={[styles.text, { color: colors.text }]}>
              शुभ मुहूर्त: {panchang.shubh_muhurat}
            </Text>
          </View>
        </View>

        {/* Yoga & Karana */}

        <View style={styles.yogaRow}>
          <View style={styles.rowFlex}>
            <Activity size={16} color={colors.primary} />

            <Text style={[styles.text, { color: colors.text }]}>
              योग: {panchang.yoga}
            </Text>
          </View>

          <View style={styles.rowEnd}>
            <Moon size={16} color={colors.textLight} />

            <Text style={[styles.text, { color: colors.text }]}>
              करण: {panchang.karana}
            </Text>
          </View>
        </View>

        {/* Sunrise Sunset */}

        <View style={[styles.footer, borderTopStyle]}>
          <View style={styles.row}>
            <Sunrise size={14} color={colors.orange} />

            <Text style={[styles.smallText, { color: colors.textLight }]}>
              {panchang.sunrise}
            </Text>
          </View>

          <View style={styles.row}>
            <Sunset size={14} color={colors.orange} />

            <Text style={[styles.smallText, { color: colors.textLight }]}>
              {panchang.sunset}
            </Text>
          </View>

          <Text style={[styles.linkText, { color: colors.saffron }]}>
            विस्तृत पंचांग ›
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

export default memo(PanchangSection);

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
  },

  card: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    shadowOpacity: 0.1,
    elevation: 2,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  rowSpacing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },

  column: {
    marginBottom: 16,
  },

  yogaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  rowFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },

  rowEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    justifyContent: 'flex-end',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
  },

  text: {
    fontSize: 14,
    fontWeight: '700',
  },

  smallText: {
    fontSize: 12,
    fontWeight: '700',
  },

  linkText: {
    fontWeight: '700',
  },

  dateText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
