import React, {
    createContext,
    useEffect,
    useMemo,
    useState,
    useCallback,
    ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';
import { BookmarkItem } from '../types';

interface BookmarkContextType {
    bookmarks: BookmarkItem[];
    toggleOffset: (item: BookmarkItem) => void;
    isBookmarked: (id: string) => boolean;
}

export const BookmarkContext = createContext<BookmarkContextType | null>(null);

interface BookmarkProviderProps {
    children: ReactNode;
}

export const BookmarkProvider: React.FC<BookmarkProviderProps> = ({ children }) => {
    const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

    // Load bookmarks
    useEffect(() => {
        (async () => {
            try {
                const raw = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS);
                if (raw) {
                    setBookmarks(JSON.parse(raw));
                }
            } catch (err) {
                console.error('Error loading bookmarks:', err);
            }
        })();
    }, []);

    // Save bookmarks
    useEffect(() => {
        const save = async () => {
            try {
                await AsyncStorage.setItem(
                    STORAGE_KEYS.BOOKMARKS,
                    JSON.stringify(bookmarks),
                );
            } catch (err) {
                console.error('Error saving bookmarks:', err);
            }
        };
        save();
    }, [bookmarks]);

    const toggleOffset = useCallback((item: BookmarkItem) => {
        setBookmarks(prev => {
            const exists = prev.find(b => b.id === item.id);
            if (exists) {
                return prev.filter(b => b.id !== item.id);
            } else {
                return [...prev, { ...item, timestamp: Date.now() }];
            }
        });
    }, []);

    const isBookmarked = useCallback(
        (id: string) => bookmarks.some(b => b.id === id),
        [bookmarks],
    );

    const value = useMemo(
        () => ({
            bookmarks,
            toggleOffset,
            isBookmarked,
        }),
        [bookmarks, toggleOffset, isBookmarked],
    );

    return <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>;
};
