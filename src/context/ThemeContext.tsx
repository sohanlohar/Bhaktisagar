import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
    useCallback,
    ReactNode
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { LIGHT_COLORS, DARK_COLORS } from '../theme/colors';

const STORAGE_KEY = 'themeMode';

type ThemeContextType = {
    isDarkMode: boolean;
    toggleTheme: () => void;
    colors: typeof LIGHT_COLORS;
};

const ThemeContext = createContext<ThemeContextType>({
    isDarkMode: false,
    toggleTheme: () => { },
    colors: LIGHT_COLORS,
});

type ThemeProviderProps = {
    children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {

    const [isDarkMode, setIsDarkMode] = useState(false); // Default to light theme

    useEffect(() => {

        const loadTheme = async () => {
            try {

                const savedTheme = await AsyncStorage.getItem(STORAGE_KEY);

                if (savedTheme !== null) {
                    setIsDarkMode(savedTheme === 'dark');
                }

            } catch (e) {
                console.log('Theme load error', e);
            }
        };

        loadTheme();

    }, []);

    const toggleTheme = useCallback(() => {
        setIsDarkMode(prev => {
            const newMode = !prev;
            AsyncStorage.setItem(
                STORAGE_KEY,
                newMode ? 'dark' : 'light'
            ).catch((e) => {
                // Theme still toggles in-memory; persistence failure shouldn't break UI.
                console.log('Theme save error', e);
            });
            return newMode;
        });
    }, []);

    const themeValues = useMemo(() => ({
        isDarkMode,
        toggleTheme,
        colors: isDarkMode ? DARK_COLORS : LIGHT_COLORS,
    }), [isDarkMode, toggleTheme]);

    return (
        <ThemeContext.Provider value={themeValues}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);