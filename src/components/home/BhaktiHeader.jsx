import { useNavigation } from '@react-navigation/native';
import { Bell, Heart, Search } from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { ROUTES } from '../../constants';
import { useTheme } from '../../context/ThemeContext';


export function BhaktiHeader() {
    const { colors } = useTheme();
    const navigation = useNavigation();

    return (
        <View
            className="flex-row items-center justify-between px-3 py-2"
            style={{ backgroundColor: colors.headerBg }}
        >
            <View className="flex-row items-center">
                <View className="rounded-full items-center justify-center shadow-sm">
                    <Image
                        source={require('../../assets/app_icon.webp')}
                        style={{ width: 40, height: 40, resizeMode: 'contain' }}
                        className='rounded-full'
                    />
                </View>
            </View>

            <View className="flex-row items-center gap-2">
                <Pressable className="flex-row items-center" onPress={() => navigation.navigate(ROUTES.BOOKMARKS)}>
                    <Heart size={25} color={colors.headerText || 'white'} />
                    <View className="absolute top-0 right-0 bg-white rounded-full w-4 h-4 items-center justify-center border border-gray-100">
                        <Text className="text-[8px] font-bold" style={{ color: colors.text }}>0</Text>
                    </View>
                </Pressable>
                {/* <Pressable className="p-1 ml-1">
                    <Bell size={22} color={colors.headerText} />
                </Pressable> */}
                <Pressable
                    className="p-1 ml-1"
                    onPress={() => navigation.navigate(ROUTES.SEARCH)}
                >
                    <Search size={25} color={colors.headerText || 'white'} />
                </Pressable>
                {/* <Pressable
                    className="p-1 ml-1"
                    onPress={() => navigation.navigate(ROUTES.SETTINGS)}
                >
                    <Settings size={22} color={colors.headerText || 'white'} />
                </Pressable> */}
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
