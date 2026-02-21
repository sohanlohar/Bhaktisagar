import React from 'react';
import { View, Text, Pressable, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import ScreenWrapper from '../components/ScreenWrapper';
import { ChevronLeft, Moon, Sun, Bell, Shield, Info } from 'lucide-react-native';

const ProfileScreen = () => {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const navigation = useNavigation();

  const MenuItem = ({ icon: Icon, label, value, onValueChange, type = 'arrow' }) => (
    <View className="flex-row items-center justify-between p-4 mb-3 rounded-2xl border" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
      <View className="flex-row items-center">
        <View className="w-10 h-10 rounded-xl items-center justify-center mr-4" style={{ backgroundColor: colors.background }}>
          <Icon size={20} color={colors.primary} />
        </View>
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: '500' }}>{label}</Text>
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

  return (
    <ScreenWrapper>
      <View style={{ flex: 1, backgroundColor: colors.background }} className="p-5">
      <View className="flex-row items-center mb-8">
        <Pressable
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: colors.cardBg }}
        >
          <ChevronLeft size={22} color={colors.text} />
        </Pressable>
        <Text className="text-3xl font-bold" style={{ color: colors.text }}>सेटिंग्स</Text>
      </View>

      <MenuItem
        icon={isDarkMode ? Moon : Sun}
        label="Dark Mode"
        type="switch"
        value={isDarkMode}
        onValueChange={toggleTheme}
      />
      <MenuItem icon={Bell} label="नोटिफिकेशन" />
      <MenuItem icon={Shield} label="प्राइवेसी" />
      <MenuItem icon={Info} label="हमारे बारे में" />

      <Text className="text-center mt-10" style={{ color: colors.textLight, fontSize: 12 }}>Version 0.0.1</Text>
      </View>
    </ScreenWrapper>
  );
};

export default ProfileScreen;