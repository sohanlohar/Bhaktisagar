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
    Category: { kind: string; title: string };
    Subcategory: { kind: string; title: string };
    DetailList: { title: string; items: ContentItem[] };
    Detail: { item: ContentItem }; // New Detail screen
};
