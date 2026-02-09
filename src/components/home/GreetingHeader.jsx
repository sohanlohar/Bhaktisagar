import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Bell, User } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

export default function GreetingHeader() {
    const { colors } = useTheme();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'शुभ प्रभात';
        if (hour < 17) return 'शुभ दोपहर';
        return 'शुभ संध्या';
    };

    return (
        <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
            <View>
                <Text className="text-[14px] font-medium" style={{ color: colors.textLight }}>
                    नमस्ते !
                </Text>
                <Text className="text-[22px] font-bold" style={{ color: colors.text }}>
                    {getGreeting()}
                </Text>
            </View>
            <View className="flex-row items-center">
                <Pressable className="mr-4 w-11 h-11 rounded-2xl bg-white items-center justify-center shadow-sm" style={{ backgroundColor: colors.cardBg, elevation: 1 }}>
                    <Bell size={22} color={colors.primary} />
                    <View className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                </Pressable>
                <Pressable className="w-11 h-11 rounded-2xl bg-white items-center justify-center shadow-sm" style={{ backgroundColor: colors.cardBg, elevation: 1 }}>
                    <User size={22} color={colors.primary} />
                </Pressable>
            </View>
        </View>
    );
}
