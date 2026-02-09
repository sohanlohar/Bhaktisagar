import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Menu, MapPin, Calendar, Sun, Heart, Bell } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

export function BhaktiHeader() {
    const { colors } = useTheme();

    return (
        <View
            className="flex-row items-center justify-between px-3 h-14"
            style={{ backgroundColor: colors.gold }}
        >
            <View className="flex-row items-center">
                <Menu size={28} color="#444" />
                <View className="ml-2 w-10 h-10 rounded-full overflow-hidden bg-white items-center justify-center border border-orange-100 shadow-sm">
                    <Image
                        source={require('../../assets/app_icon.png')}
                        style={{ width: 38, height: 38, resizeMode: 'contain' }}
                    />
                </View>
            </View>

            <View className="flex-row items-center">
                <Pressable className="p-1">
                    <MapPin size={22} color="#E65100" />
                </Pressable>
                <Pressable className="p-1">
                    <Calendar size={22} color="#E65100" />
                </Pressable>
                <Pressable className="p-1">
                    <Sun size={22} color="#E65100" />
                </Pressable>
                <Pressable className="flex-row items-center p-1">
                    <Heart size={22} color="#E65100" />
                    <View className="absolute top-0 right-0 bg-white rounded-full w-4 h-4 items-center justify-center border border-gray-100">
                        <Text className="text-[8px] font-bold">0</Text>
                    </View>
                </Pressable>
                <Pressable className="p-1 ml-1">
                    <Bell size={22} color="#E65100" />
                </Pressable>
            </View>
        </View>
    );
}

export function SpecialTicker() {
    const { colors } = useTheme();

    return (
        <View className="flex-row items-center bg-white border-b border-gray-100" style={{ height: 40 }}>
            <View className="h-full px-3 items-center justify-center" style={{ backgroundColor: colors.orange || '#E65100' }}>
                <Text className="text-white text-[12px] font-bold text-center leading-4">आज का{"\n"}विशेष</Text>
            </View>
            <View className="flex-1 px-4">
                <Text className="text-[14px] font-medium" numberOfLines={1}>
                    <Text style={{ color: colors.orange || '#E65100' }}>विष्णु भजन</Text>
                    <Text style={{ color: '#999' }}>  |  </Text>
                    <Text style={{ color: colors.orange || '#E65100' }}>भजन: तुने मुझे बुलाया शेरा वालिए</Text>
                </Text>
            </View>
        </View>
    );
}
