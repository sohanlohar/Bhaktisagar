import React, { memo, useCallback, useMemo } from 'react';
import { View, Text, Pressable, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import ScreenWrapper from '../components/ScreenWrapper';
import { ChevronLeft, Moon, Sun } from 'lucide-react-native';
import pkg from '../../package.json';

const MenuItem = memo(function MenuItem({
  colors,
  icon: Icon,
  label,
  value,
  onValueChange,
  type = 'arrow',
}) {
  return (
    <View
      className="flex-row items-center justify-between p-4 mb-3 rounded-2xl border"
      style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
    >
      <View className="flex-row items-center">
        <View
          className="w-10 h-10 rounded-xl items-center justify-center mr-4"
          style={{ backgroundColor: colors.background }}
        >
          <Icon size={20} color={colors.primary} />
        </View>
        <Text className="text-base font-pmedium" style={{ color: colors.text }}>
          {label}
        </Text>
      </View>

      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.border, true: colors.saffron + '77' }}
          thumbColor={value ? colors.saffron : colors.textLight}
        />
      ) : (
        <Text style={{ color: colors.textLight }}>›</Text>
      )}
    </View>
  );
});

const ProfileScreen = () => {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const navigation = useNavigation();

  const onBack = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <ScreenWrapper>
      <View className="flex-1 p-5" style={{ backgroundColor: colors.background }}>
        <View className="flex-row items-center mb-8">
          <Pressable
            onPress={onBack}
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: colors.cardBg }}
          >
            <ChevronLeft size={22} color={colors.text} />
          </Pressable>
          <Text className="text-3xl font-pbold" style={{ color: colors.text }}>सेटिंग्स</Text>
        </View>

        <MenuItem
          colors={colors}
          icon={isDarkMode ? Moon : Sun}
          label="Dark Mode"
          type="switch"
          value={isDarkMode}
          onValueChange={toggleTheme}
        />

        <Text className="text-center mt-10 text-xs" style={{ color: colors.textLight }}>
          Version {pkg.version}
        </Text>
      </View>
    </ScreenWrapper>
  );
};

export default ProfileScreen;
