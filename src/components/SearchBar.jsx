import React from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Search, Settings } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

export default function SearchBar({ placeholder = "खोजें...", onSettingsPress }) {
    const { colors, toggleTheme } = useTheme();

    return (
        <View className="flex-row items-center px-4 mt-4">
            <View
                className="flex-1 flex-row items-center h-12 px-4 rounded-2xl border shadow-sm"
                style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.border,
                    elevation: 2
                }}
            >
                <Search size={20} color={colors.textLight} />
                <TextInput
                    placeholder={placeholder}
                    className="flex-1 ml-2 text-[15px]"
                    style={{ color: colors.text }}
                    placeholderTextColor={colors.textLight}
                />
            </View>
            <Pressable
                onPress={toggleTheme}
                className="ml-3 w-12 h-12 rounded-2xl items-center justify-center border shadow-sm"
                style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.border,
                    elevation: 2
                }}
            >
                <Settings size={22} color={colors.primary} />
            </Pressable>
        </View>
    );
}
