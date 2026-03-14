import { useContext } from "react";
import { BookmarkContext } from "../context/BookmarkContext";

export const useBookmarks = () => {
    return useContext(BookmarkContext);
};