import { useCallback, useContext, useMemo } from 'react';
import { BookmarkContext } from '../context/BookmarkContext';

const noopToggle = (_item: any) => {};
const noopIsBookmarked = (_id: string) => false;

/**
 * Bookmark hook with a stable API for all screens.
 *
 * Usage:
 * - useBookmarks() => { bookmarks, toggle, isBookmarked, bookmarked }
 * - useBookmarks(id, title) => { bookmarks, toggle, isBookmarked, bookmarked }
 *   where `toggle` is bound to the given (id,title) and takes no args.
 */
export const useBookmarks = (id?: string, title?: string) => {
  const context = useContext(BookmarkContext);

  const bookmarks = context?.bookmarks ?? [];
  const toggle = context?.toggle ?? noopToggle;
  const isBookmarked = context?.isBookmarked ?? noopIsBookmarked;

  const bookmarked = useMemo(() => {
    if (!id) return false;
    return isBookmarked(id);
  }, [id, isBookmarked]);

  const toggleBound = useCallback(() => {
    if (!id) return;
    toggle({ id, title: title ?? '' });
  }, [id, title, toggle]);

  return {
    bookmarks,
    // For most callers we want the original toggle signature: toggle(item)
    // For DetailListScreen we pass (id,title) and want toggle() with no args.
    toggle: id ? toggleBound : toggle,
    isBookmarked,
    bookmarked,
  };
};