import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  Platform,
  FlatList,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { get7Day, getToday } from '../services/weatherApi';

export default function WeatherScreen() {
  const [today, setToday] = useState(null);
  const [list, setList] = useState([]);

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

  return (
    <View className="flex-1 p-4">
      <Text className="text-xl font-semibold mb-3">आज का मौसम</Text>
      {today && (
        <View className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
          <Text className="text-text">{today.name}</Text>
          <Text className="text-text mt-1">
            {today.weather?.[0]?.description}
          </Text>
          <Text className="text-text mt-1">
            तापमान: {Math.round(today.main?.temp)}°C
          </Text>
        </View>
      )}

      <Text className="text-lg font-semibold mb-2">अगले 7 दिन</Text>
      <FlatList
        data={list}
        keyExtractor={(i, idx) => String(idx)}
        renderItem={({ item }) => (
          <View className="bg-white border border-gray-200 rounded-xl p-3 mb-2">
            <Text className="text-text">
              {new Date(item.dt * 1000).toDateString()}
            </Text>
            <Text className="text-muted text-[12px]">
              {item.weather?.[0]?.description} — {Math.round(item.main?.temp)}°C
            </Text>
          </View>
        )}
      />
    </View>
  );
}

async function requestLocationPermission() {
  if (Platform.OS === 'ios') return true; // add iOS permission plist entries separately
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}
