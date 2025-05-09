export type VideoTag = 'промо' | 'химия' | 'биология';
export type VideoDifficulty = 'сложно' | 'средне' | 'легко';

export interface Video {
    id: number;
    title: string;
    url: string;
    tag: VideoTag;
    description: string;
    difficulty: VideoDifficulty;
    created_at: string;
    updated_at: string;
} 