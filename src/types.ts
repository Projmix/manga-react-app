export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdManga: Manga[]; // Связь с Manga
}

// Интерфейс для модели Manga
export interface Manga {
  id: string;
  title: string;
  image: string;
  description: string;
  genres: string;
  createdChapters: Chapters[]; // Связь с Chapters
  user: User; // Связь с User
  userId: string;
}

// Интерфейс для модели Chapters
export interface Chapters {
  id: string;
  name: string;
  files: string;
  mangaId: string;
}

// Интерфейс для модели ChaptersTranslate
export interface ChaptersTranslate {
  id: string;
  name: string;
  files: string;
  chapterId: string;
}

export interface ErrorWithMessage {
    status: number,
    data: {
        message: string
    }
}
export interface SettingsTranslate {
    target_language: string;
    detector: string;
    direction: string;
    translator: string;
    size: string;
    retry: string;
  }

  export interface SettingsPage{
    readMode: 'horizontal' | 'vertical';
    pageFlipArea: 'image' | 'fullScreen';
    includeImages: boolean;
    containerWidth: number;
  }