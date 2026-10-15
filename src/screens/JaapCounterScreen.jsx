import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AppState,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Minus, Plus, Sparkles } from 'lucide-react-native';

import ScreenWrapper from '../components/ScreenWrapper';
import { useTheme } from '../context/ThemeContext';

const STORAGE_KEY = 'JAAP_COUNTER_PROGRESS';
const MALA_SIZE = 108;
const EMPTY_PROGRESS = { mantra: '', count: 0, date: '' };
const styles = StyleSheet.create({
  disabledCountButton: { opacity: 0.4 },
});

let writeQueue = Promise.resolve();

const getLocalDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const persistProgress = (progress) => {
  const write = writeQueue.then(() =>
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress)),
  );
  writeQueue = write.catch(() => {});
  return write;
};

const isValidProgress = (value) =>
  value &&
  typeof value.mantra === 'string' &&
  Number.isSafeInteger(value.count) &&
  value.count >= 0 &&
  typeof value.date === 'string';

const JaapCounterScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [progress, setProgress] = useState(null);
  const progressRef = useRef(null);
  const [draftMantra, setDraftMantra] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');

  const loadProgress = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const stored = raw ? JSON.parse(raw) : EMPTY_PROGRESS;
      if (!isValidProgress(stored)) {
        throw new Error('Saved Jaap progress has an invalid format.');
      }

      const today = getLocalDateKey();
      const current = stored.date === today
        ? stored
        : { ...stored, count: 0, date: today };

      progressRef.current = current;
      setProgress(current);
      setDraftMantra(current.mantra);
      if (raw && stored.date !== today) {
        await persistProgress(current);
      }
    } catch (error) {
      console.error('Jaap progress load error:', error);
      setLoadError('जप की जानकारी लोड नहीं हो सकी। कृपया फिर कोशिश करें।');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  useEffect(() => {
    const resetCountIfDateChanged = () => {
      if (!progressRef.current) return;
      const today = getLocalDateKey();
      if (progressRef.current.date !== today) {
        const next = { ...progressRef.current, count: 0, date: today };
        progressRef.current = next;
        setProgress(next);
        setSaveError('');
        persistProgress(next).catch((error) => {
          console.error('Jaap daily reset save error:', error);
          setSaveError('आज का नया जप काउंटर सेव नहीं हो सका।');
        });
      }
    };

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') resetCountIfDateChanged();
    });
    const timer = setInterval(resetCountIfDateChanged, 30_000);

    return () => {
      subscription.remove();
      clearInterval(timer);
    };
  }, []);

  const commitProgress = useCallback(async (next) => {
    progressRef.current = next;
    setProgress(next);
    setSaveError('');
    try {
      await persistProgress(next);
    } catch (error) {
      console.error('Jaap progress save error:', error);
      setSaveError('जप की जानकारी सेव नहीं हो सकी। कृपया दोबारा कोशिश करें।');
    }
  }, []);

  const saveMantra = useCallback(() => {
    const mantra = draftMantra.trim();
    if (!mantra) {
      setSaveError('कृपया पहले उस नाम या मंत्र को लिखें जिसका जाप करना है।');
      return;
    }

    const current = progressRef.current || EMPTY_PROGRESS;
    commitProgress({
      mantra,
      count: mantra === current.mantra ? current.count : 0,
      date: getLocalDateKey(),
    }).then(() => {
      setDraftMantra(mantra);
      setIsEditing(false);
    });
  }, [commitProgress, draftMantra]);

  const changeCount = useCallback((amount) => {
    const current = progressRef.current;
    if (!current?.mantra) return;

    const nextCount = Math.max(0, current.count + amount);
    if (!Number.isSafeInteger(nextCount)) {
      setSaveError('जप संख्या की अधिकतम सीमा पूरी हो गई है।');
      return;
    }

    commitProgress({ ...current, count: nextCount });
  }, [commitProgress]);

  const onBack = useCallback(() => navigation.goBack(), [navigation]);

  if (loading) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
          <Text className="font-pmedium" style={{ color: colors.textLight }}>जप काउंटर लोड हो रहा है...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (loadError) {
    return (
      <ScreenWrapper>
        <View className="flex-1 p-5" style={{ backgroundColor: colors.background }}>
          <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="वापस जाएँ" className="mb-8 h-11 w-11 items-center justify-center rounded-full" style={{ backgroundColor: colors.cardBg }}>
            <ChevronLeft size={24} color={colors.text} />
          </Pressable>
          <Text className="mb-4 text-center font-pmedium" style={{ color: colors.text }}>{loadError}</Text>
          <Pressable onPress={loadProgress} accessibilityRole="button" className="self-center rounded-2xl px-6 py-3" style={{ backgroundColor: colors.primary }}>
            <Text className="font-pbold text-white">फिर कोशिश करें</Text>
          </Pressable>
        </View>
      </ScreenWrapper>
    );
  }

  const hasMantra = Boolean(progress?.mantra);
  const malaCount = Math.floor((progress?.count || 0) / MALA_SIZE);
  const countInCurrentMala = (progress?.count || 0) % MALA_SIZE;

  return (
    <ScreenWrapper>
      <View className="flex-1 px-5 pb-6" style={{ backgroundColor: colors.background }}>
        <View className="mb-8 mt-2 flex-row items-center">
          <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="वापस जाएँ" className="mr-3 h-11 w-11 items-center justify-center rounded-full" style={{ backgroundColor: colors.cardBg }}>
            <ChevronLeft size={24} color={colors.text} />
          </Pressable>
          <Text className="text-2xl font-pbold" style={{ color: colors.text }}>डिजिटल जप</Text>
        </View>

        {!hasMantra || isEditing ? (
          <View className="flex-1 justify-center">
            <View className="mb-6 items-center">
              <View className="mb-4 h-20 w-20 items-center justify-center rounded-full" style={{ backgroundColor: colors.saffron + '20' }}>
                <Sparkles size={36} color={colors.orange} />
              </View>
              <Text className="mb-2 text-center text-xl font-pbold" style={{ color: colors.text }}>
                {hasMantra ? 'नाम बदलें' : 'किस नाम का जाप करना चाहते हैं?'}
              </Text>
              <Text className="text-center text-sm font-pmedium" style={{ color: colors.textLight }}>
                आपका नाम इस डिवाइस पर सेव रहेगा।
              </Text>
            </View>

            <TextInput
              value={draftMantra}
              onChangeText={(text) => {
                setDraftMantra(text);
                setSaveError('');
              }}
              placeholder="जैसे: श्री राम"
              placeholderTextColor={colors.textLight}
              maxLength={80}
              returnKeyType="done"
              onSubmitEditing={saveMantra}
              accessibilityLabel="जाप के लिए नाम या मंत्र"
              className="mb-3 rounded-2xl border px-4 py-4 text-base font-pmedium"
              style={{ backgroundColor: colors.cardBg, borderColor: colors.border, color: colors.text }}
            />
            {saveError ? (
              <Text className="mb-3 text-center text-sm font-pmedium" style={{ color: colors.pillRed }}>{saveError}</Text>
            ) : null}
            <Pressable onPress={saveMantra} accessibilityRole="button" className="items-center rounded-2xl py-4" style={{ backgroundColor: colors.primary }}>
              <Text className="font-pbold text-white">{hasMantra ? 'नाम सेव करें' : 'जप शुरू करें'}</Text>
            </Pressable>
            {hasMantra && (
              <Pressable
                onPress={() => {
                  setDraftMantra(progress.mantra);
                  setSaveError('');
                  setIsEditing(false);
                }}
                accessibilityRole="button"
                className="mt-3 items-center rounded-2xl py-4"
              >
                <Text className="font-pmedium" style={{ color: colors.textLight }}>रद्द करें</Text>
              </Pressable>
            )}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="mb-2 text-sm font-pmedium" style={{ color: colors.textLight }}>आज आप जाप कर रहे हैं</Text>
            <Text className="mb-10 text-3xl font-pbold text-center" style={{ color: colors.primary }} numberOfLines={2}>
              {progress.mantra}
            </Text>

            <View className="mb-8 h-56 w-56 items-center justify-center rounded-full border-8" style={{ borderColor: colors.saffron, backgroundColor: colors.cardBg }}>
              <Text accessibilityLiveRegion="polite" className="text-6xl font-pbold" style={{ color: colors.text }}>
                {progress.count}
              </Text>
              <Text className="mt-1 text-sm font-pmedium" style={{ color: colors.textLight }}>आज का जप</Text>
            </View>

            <View className="mb-8 flex-row items-center">
              <Text className="font-pbold" style={{ color: colors.orange }}>
                {malaCount} माला पूरी
              </Text>
              <Text className="mx-2" style={{ color: colors.textLight }}>·</Text>
              <Text className="font-pmedium" style={{ color: colors.textLight }}>
                अगली माला: {countInCurrentMala}/{MALA_SIZE}
              </Text>
            </View>

            {saveError ? (
              <Text className="mb-4 text-center text-sm font-pmedium" style={{ color: colors.pillRed }}>{saveError}</Text>
            ) : null}

            <View className="flex-row items-center">
              <Pressable
                onPress={() => changeCount(-1)}
                disabled={progress.count === 0}
                accessibilityRole="button"
                accessibilityLabel="एक जप कम करें"
                className="mr-5 h-16 w-16 items-center justify-center rounded-full border"
                style={[
                  { backgroundColor: colors.cardBg, borderColor: colors.border },
                  progress.count === 0 && styles.disabledCountButton,
                ]}
              >
                <Minus size={24} color={colors.text} />
              </Pressable>
              <Pressable
                onPress={() => changeCount(1)}
                accessibilityRole="button"
                accessibilityLabel={`${progress.mantra} का एक जप जोड़ें`}
                className="h-24 w-24 items-center justify-center rounded-full"
                style={{ backgroundColor: colors.primary }}
              >
                <Plus size={34} color="#FFFFFF" />
              </Pressable>
            </View>

            <Pressable
              onPress={() => {
                setDraftMantra('');
                setSaveError('');
                setIsEditing(true);
              }}
              accessibilityRole="button"
              className="mt-8 rounded-xl px-4 py-2"
            >
              <Text className="font-pmedium" style={{ color: colors.textLight }}>जाप का नाम बदलें</Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default JaapCounterScreen;
