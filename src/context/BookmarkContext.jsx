import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create Context
const Ctx = createContext(null);

// Provider Component
export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState([]);

  // 🔹 Load bookmarks from AsyncStorage when app starts
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('BOOKMARKS');
        if (raw) setBookmarks(JSON.parse(raw));
      } catch (err) {
        console.error('Error loading bookmarks:', err);
      }
    })();
  }, []);

  // 🔹 Save bookmarks whenever they change
  useEffect(() => {
    AsyncStorage.setItem('BOOKMARKS', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // 🔹 Toggle bookmark (add/remove)
  const toggle = useCallback(item => {
    setBookmarks(prev =>
      prev.find(b => b.id === item.id)
        ? prev.filter(b => b.id !== item.id)
        : [...prev, item],
    );
  }, []);

  // 🔹 Check if bookmarked
  const isBookmarked = useCallback(
    id => bookmarks.some(b => b.id === id),
    [bookmarks],
  );

  // 🔹 Memoized value for context consumers
  const value = useMemo(
    () => ({
      bookmarks,
      toggle,
      isBookmarked,
    }),
    [bookmarks, toggle, isBookmarked],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

// Custom Hook
export const useBookmarks = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useBookmarks must be used inside BookmarkProvider');
  return v;
};
