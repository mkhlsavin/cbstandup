export enum VideoTag {
  PROMO = 'промо',
  CHEMISTRY = 'химия',
  BIOLOGY = 'биология',
}

export enum VideoDifficulty {
  HARD = 'сложно',
  MEDIUM = 'средне',
  EASY = 'легко',
}

export interface Video {
  id: number;
  title: string;
  url: string;
  tag: VideoTag;
  description?: string;
  difficulty?: VideoDifficulty;
  created_at: Date;
  updated_at: Date;
}
