import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTodayPanchang } from './panchangApi';

const CACHE_KEY = 'PANCHANG_YEAR_CACHE';

export async function preCalculateYearPanchang(year = new Date().getFullYear()) {

    const existing = await AsyncStorage.getItem(CACHE_KEY);

    if (existing) {
        const parsed = JSON.parse(existing);
        if (parsed.year === year) {
            return parsed.data;
        }
    }

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const data = {};
    const current = new Date(startDate);

    while (current <= endDate) {

        const result = await getTodayPanchang(new Date(current));

        const key = current.toISOString().split('T')[0];

        data[key] = result;

        current.setDate(current.getDate() + 1);
    }

    await AsyncStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
            year,
            data
        })
    );

    return data;
}