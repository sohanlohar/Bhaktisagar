import React, {
    createContext,
    useEffect,
    useMemo,
    useState,
    useCallback,
    ReactNode,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../constants";

export interface BookmarkItem {
    id: string;
    title: string;
    kind?: string;
    timestamp?: number;
}

interface BookmarkContextType {
    bookmarks: BookmarkItem[];
    toggle: (item: BookmarkItem) => void;
    isBookmarked: (id: string) => boolean;
}

export const BookmarkContext = createContext<BookmarkContextType>({
    bookmarks: [],
    toggle: () => { },
    isBookmarked: () => false,
});

interface Props {
    children: ReactNode;
}

export const BookmarkProvider: React.FC<Props> = ({ children }) => {
    const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

    /* ---------- Load ---------- */

    useEffect(() => {
        const load = async () => {
            try {
                const raw = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS);

                if (raw) {
                    setBookmarks(JSON.parse(raw));
                }
            } catch (err) {
                console.log("Bookmark load error", err);
            }
        };

        load();
    }, []);

    /* ---------- Save ---------- */

    useEffect(() => {
        AsyncStorage.setItem(
            STORAGE_KEYS.BOOKMARKS,
            JSON.stringify(bookmarks)
        );
    }, [bookmarks]);

    /* ---------- Toggle ---------- */

    const toggle = useCallback((item: BookmarkItem) => {
        setBookmarks(prev => {
            const exists = prev.find(b => b.id === item.id);

            if (exists) {
                return prev.filter(b => b.id !== item.id);
            }

            return [...prev, { ...item, timestamp: Date.now() }];
        });
    }, []);

    /* ---------- Check ---------- */

    const isBookmarked = useCallback(
        (id: string) => bookmarks.some(b => b.id === id),
        [bookmarks]
    );

    const value = useMemo(
        () => ({
            bookmarks,
            toggle,
            isBookmarked,
        }),
        [bookmarks, toggle, isBookmarked]
    );

    return (
        <BookmarkContext.Provider value={value}>
            {children}
        </BookmarkContext.Provider>
    );
};