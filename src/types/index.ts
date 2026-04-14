export interface ContentItem {
    id: string;
    title: string;
    kind?: string; // 'bhajan', 'aarti', etc.
    lyrics?: string; // The main text content
    content?: string; // Fallback content or alias for lyrics
    image?: any; // For icon tiles
}

export interface BookmarkItem {
    id: string;
    title: string;
    kind?: string;
    timestamp: number; // When it was bookmarked
}

export type RootStackParamList = {
    HomeTab: undefined;
    BrowseCategory: { kind: string; title: string };
    Detail: { item: ContentItem }; // Detail screen
};
