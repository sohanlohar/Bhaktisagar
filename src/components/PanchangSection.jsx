import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { Sun, Wind, Clock, Sparkles, Sunrise, Sunset, Moon, Activity } from 'lucide-react-native';

export default function PanchangSection({ panchang }) {
    const { colors } = useTheme();
    const navigation = useNavigation();

    if (!panchang) {
        return null;
    }

    return (
        <View className="px-4">
            <Pressable
                onPress={() => navigation.navigate('Panchang')}
                className="rounded-3xl p-5 border shadow-sm"
                style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
            >
                <View className="flex-row justify-between items-center mb-4">
                    <View className="flex-row gap-2 items-center">
                        <Sun size={20} color={colors.saffron} />
                        <Text className="text-md font-bold" style={{ color: colors.text }}>
                            {panchang.tithi}
                        </Text>
                    </View>
                    <Text className="text-md font-bold">{panchang.dayName} var - {panchang.date}</Text>
                </View>

                {/* Nakshatra & Rahukal */}
                <View className="flex-row justify-between mb-2">
                    <View className="flex-row gap-1 items-center">
                        <Wind size={16} color={colors.textLight} />
                        <Text className="text-md font-bold" style={{ color: colors.text }}>नक्षत्र: {panchang?.nakshatra}</Text>

                    </View>

                </View>

                <View className="flex-column justify-between">
                    <View className="flex-row gap-2 items-center mb-2">
                        <Clock size={16} color={colors.pillRed} />
                        <Text className="text-base font-bold" style={{ color: colors.text }}>राहुकाल: {panchang.rahukal}</Text>
                    </View>

                    {/* Shubh Muhurat */}
                    <View className="flex-row gap-2 items-center mb-4">
                        <Sparkles size={16} color={colors.saffron} />
                        <Text className="text-md font-bold" style={{ color: colors.text }}>शुभ मुहूर्त: {panchang.shubh_muhurat}</Text>
                    </View>
                </View>



                {/* Yoga & Karana */}
                <View className="flex-row justify-between mb-4">

                    <View className="flex-row items-center gap-2 flex-1">
                        <Activity size={16} color={colors.primary} />
                        <Text className="text-md font-bold" style={{ color: colors.text }}>
                            योग: {panchang?.yoga}
                        </Text>
                    </View>

                    <View className="flex-row items-center gap-2 flex-1 justify-end">
                        <Moon size={16} color={colors.textLight} />
                        <Text className="text-md font-bold" style={{ color: colors.text }}>
                            करण: {panchang?.karana}
                        </Text>
                    </View>

                </View>

                <View className="flex-row justify-between pt-3 border-t" style={{ borderTopColor: colors.border + '55' }}>
                    <View className="flex-row gap-2 items-center">
                        <Sunrise size={14} color={colors.orange} />
                        <Text className='text-sm font-bold' style={{ color: colors.textLight }}>{panchang.sunrise}</Text>
                    </View>
                    <View className="flex-row gap-2 items-center">
                        <Sunset size={14} color={colors.orange} />
                        <Text className='text-sm font-bold' style={{ color: colors.textLight }}>{panchang.sunset}</Text>
                    </View>
                    <Text className="font-bold" style={{ color: colors.saffron }}>विस्तृत पंचांग ›</Text>
                </View>
            </Pressable>
        </View>
    );
}
