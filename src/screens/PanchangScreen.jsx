import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import {
  getNext7DaysPanchang,
  getTodayPanchang,
} from '../services/panchangApi';

export default function PanchangScreen() {
  const [today, setToday] = useState(null);
  const [week, setWeek] = useState([]);
  useEffect(() => {
    (async () => {
      setToday(await getTodayPanchang());
      setWeek(await getNext7DaysPanchang());
    })();
  }, []);
  return (
    <View className="flex-1 p-4">
      <Text className="text-xl font-semibold mb-3">आज का पंचांग</Text>
      {today && (
        <View className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
          <Text className="text-text">{today.date}</Text>
          <Text className="text-text mt-1">तिथि: {today.tithi}</Text>
          <Text className="text-text mt-1">नक्षत्र: {today.nakshatra}</Text>
          <Text className="text-text mt-1">योग: {today.yoga}</Text>
          <Text className="text-text mt-1">करण: {today.karana}</Text>
        </View>
      )}

      <Text className="text-lg font-semibold mb-2">अगले 7 दिन</Text>
      <FlatList
        data={week}
        keyExtractor={(i, idx) => String(idx)}
        renderItem={({ item }) => (
          <View className="bg-white border border-gray-200 rounded-xl p-3 mb-2">
            <Text className="text-text">{item.date}</Text>
            <Text className="text-muted text-[12px]">तिथि: {item.tithi}</Text>
          </View>
        )}
      />
    </View>
  );
}
