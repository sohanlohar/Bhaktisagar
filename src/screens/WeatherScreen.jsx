import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  Platform,
  FlatList,
  ScrollView,
} from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import Geolocation from 'react-native-geolocation-service';
import { get7Day, getToday } from '../services/weatherApi';
import { useTheme } from '../context/ThemeContext';
import { Cloud, Sun, CloudRain, MapPin } from 'lucide-react-native';
import { BhaktiHeader } from '../components/home/BhaktiHeader';

export default function WeatherScreen() {
  const [today, setToday] = useState(null);
  const [list, setList] = useState([]);
  const { colors, isDarkMode } = useTheme();

  useEffect(() => {
    (async () => {
      const ok = await requestLocationPermission();
      if (!ok) return;
      Geolocation.getCurrentPosition(
        async ({ coords }) => {
          const t = await getToday(coords.latitude, coords.longitude);
          const w = await get7Day(coords.latitude, coords.longitude);
          setToday(t);
          setList(w.list?.slice(0, 7) || []);
        },
        console.warn,
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    })();
  }, []);

  const getSpiritualTip = (desc) => {
    if (!desc) return "प्रसन्नता के साथ दिन की शुरुआत करें।";
    const d = desc.toLowerCase();
    if (d.includes('rain')) return "बारिश की बूंदें ईश्वर की कृपा के समान हैं।";
    if (d.includes('clear')) return "खुला आकाश, खुला मन—ईश्वर का ध्यान करें।";
    if (d.includes('cloud')) return "बादल आएंगे और जाएंगे, आत्मा की शांति स्थिर रहनी चाहिए।";
    return "प्रकृति के हर रूप में ईश्वर का वास है।";
  };

  const WeatherIcon = ({ desc, size = 24, color }) => {
    const d = desc?.toLowerCase() || '';
    if (d.includes('rain')) return <CloudRain size={size} color={color || colors.primary} />;
    if (d.includes('clear')) return <Sun size={size} color={color || colors.saffron} />;
    return <Cloud size={size} color={color || colors.textLight} />;
  };

  return (
    <ScreenWrapper>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <BhaktiHeader />
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View className="p-5">
            <Text className="text-2xl font-bold mb-6" style={{ color: colors.text }}>मौसम</Text>

            {today && (
              <View
                className="rounded-[32px] p-8 mb-8 items-center border"
                style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
              >
                <View className="flex-row items-center mb-4">
                  <MapPin size={16} color={colors.textLight} className="mr-1" />
                  <Text style={{ color: colors.textLight, fontSize: 14, fontWeight: 'medium' }}>{today.name}</Text>
                </View>

                <WeatherIcon desc={today.weather?.[0]?.description} size={80} />

                <Text className="text-5xl font-bold mt-4 mb-2" style={{ color: colors.text }}>
                  {Math.round(today.main?.temp)}°C
                </Text>

                <Text className="text-[18px] capitalize mb-6" style={{ color: colors.textLight }}>
                  {today.weather?.[0]?.description}
                </Text>

                <View className="w-full h-[1px] mb-6" style={{ backgroundColor: colors.border }} />

                <View className="bg-saffron/10 p-4 rounded-2xl w-full" style={{ backgroundColor: colors.saffron + '15' }}>
                  <Text className="text-center italic" style={{ color: colors.secondary }}>
                    "{getSpiritualTip(today.weather?.[0]?.description)}"
                  </Text>
                </View>
              </View>
            )}

            <Text className="text-xl font-bold mb-4" style={{ color: colors.text }}>आगामी ७ दिन</Text>
            {list.map((item, idx) => (
              <View
                key={idx}
                className="flex-row items-center justify-between p-4 mb-3 rounded-2xl border"
                style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
              >
                <View>
                  <Text style={{ color: colors.text, fontWeight: 'bold' }}>
                    {new Date(item.dt * 1000).toLocaleDateString('hi-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
                  </Text>
                  <Text style={{ color: colors.textLight, fontSize: 13, textTransform: 'capitalize' }}>
                    {item.weather?.[0]?.description}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="mr-3 font-bold" style={{ color: colors.text }}>{Math.round(item.main?.temp)}°C</Text>
                  <WeatherIcon desc={item.weather?.[0]?.description} size={20} />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

async function requestLocationPermission() {
  if (Platform.OS === 'ios') return true;
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}
