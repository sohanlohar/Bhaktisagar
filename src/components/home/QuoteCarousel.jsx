import React from 'react';
import { View, Text, ImageBackground, Dimensions, Pressable } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Share2, Bookmark } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

const QUOTES = [
    {
        id: '1',
        text: "श्रद्धा और विश्वास से ही ईश्वर की प्राप्ति संभव है।",
        author: "अज्ञात",
    },
    {
        id: '2',
        text: "भगवान के फैसले हमारी इच्छाओं से बेहतर होते हैं।",
        author: "स्वामी विवेकानंद",
    },
    {
        id: '3',
        text: "कर्म ही पूजा है, और सच्चाई ही धर्म है।",
        author: "महात्मा गांधी",
    }
];

export default function QuoteCarousel() {
    const { colors } = useTheme();

    const renderItem = ({ item }) => (
        <View className="px-4">
            <ImageBackground
                source={require('../../assets/hero_banner.png')}
                className="h-56 justify-center items-center rounded-[32px] overflow-hidden"
                imageStyle={{ borderRadius: 32 }}
            >
                <View className="bg-black/40 absolute inset-0" />
                <View className="p-8 items-center">
                    <Text className="text-white text-[10px] font-bold uppercase tracking-[4px] mb-4 opacity-80">आज का सुविचार</Text>
                    <Text className="text-white text-xl font-semibold leading-8 text-center px-4">
                        "{item.text}"
                    </Text>
                    <View className="w-12 h-1 bg-saffron mt-6 rounded-full" />

                    <View className="flex-row mt-6">
                        <Pressable className="mx-4 p-2 bg-white/20 rounded-full backdrop-blur-md">
                            <Share2 size={18} color="white" />
                        </Pressable>
                        <Pressable className="mx-4 p-2 bg-white/20 rounded-full backdrop-blur-md">
                            <Bookmark size={18} color="white" />
                        </Pressable>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );

    return (
        <View className="mt-4">
            <Carousel
                loop
                width={width}
                height={240}
                autoPlay={true}
                autoPlayInterval={5000}
                data={QUOTES}
                scrollAnimationDuration={1000}
                renderItem={renderItem}
            />
        </View>
    );
}
