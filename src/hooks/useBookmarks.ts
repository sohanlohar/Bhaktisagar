import { useContext } from 'react';
import { BookmarkContext } from '../context/BookmarkContext';

export const useBookmarks = () => {
    const context = useContext(BookmarkContext);
    if (!context) {
        throw new Error('useBookmarks must be used inside BookmarkProvider');
    }
    return {
        bookmarks: context.bookmarks,
        toggle: context.toggleOffset, // Alias for backward compatibility if needed, or update consumers
        isBookmarked: context.isBookmarked,
    };
};
