import { Manga, Chapters, ChaptersTranslate } from "../../types";
import { createSlice } from "@reduxjs/toolkit";
import { mangaApi } from "../../app/services/manga";
import { chaptersMangaApi } from "../../app/services/chapter-manga";
import { RootState } from "../../app/store";

interface InitialState {
    manga: (Manga & { chapters: Chapters[], chaptersTranslate?: ChaptersTranslate[] }) | null,
    mangaAll: Manga[] | null,
}

const initialState: InitialState = {
    manga: null,
    mangaAll: null,
}

const mangaSlice = createSlice({
    name: 'manga',
    initialState,
    reducers: {
        logout: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(mangaApi.endpoints.getAllManga.matchFulfilled, (state, action) => {
                state.mangaAll = action.payload;
            })
            .addMatcher(mangaApi.endpoints.getManga.matchFulfilled, (state, action) => {
                state.manga = action.payload as Manga & { chapters: Chapters[], chaptersTranslate?: ChaptersTranslate[] };
            })
            .addMatcher(mangaApi.endpoints.editManga.matchFulfilled, (state, action) => {
                state.manga = action.payload as Manga & { chapters: Chapters[], chaptersTranslate?: ChaptersTranslate[] };
            })
            .addMatcher(mangaApi.endpoints.removeManga.matchFulfilled, (state, action) => {
                state.manga = null;
            })
            .addMatcher(mangaApi.endpoints.addManga.matchFulfilled, (state, action) => {
                state.manga = action.payload as Manga & { chapters: Chapters[], chaptersTranslate?: ChaptersTranslate[] };
            })
            .addMatcher(chaptersMangaApi.endpoints.addChapterManga.matchFulfilled, (state, action) => {
                if (state.manga) {
                    state.manga.chapters.push(action.payload);
                }
            })
            .addMatcher(chaptersMangaApi.endpoints.editChapterManga.matchFulfilled, (state, action) => {
                if (state.manga) {
                    const index = state.manga.chapters.findIndex(ch => ch.id === action.payload.id);
                    if (index !== -1) {
                        state.manga.chapters[index] = action.payload;
                    }
                }
            })
            .addMatcher(chaptersMangaApi.endpoints.removeChapterManga.matchFulfilled, (state, action) => {
                if (state.manga && action.payload) {
                  state.manga.chapters = state.manga.chapters.filter(ch => ch.id !== action.payload?.id);
                }
            })              
            .addMatcher(chaptersMangaApi.endpoints.getTranslateChapterManga.matchFulfilled, (state, action) => {
                if (state.manga) {
                    state.manga.chaptersTranslate = action.payload;
                }
            })
            .addMatcher(chaptersMangaApi.endpoints.addTranslateChapterManga.matchFulfilled, (state, action) => {
                if (state.manga && state.manga.chaptersTranslate) {
                    state.manga.chaptersTranslate.push(action.payload);
                }
            });
    }
})

export const { logout } = mangaSlice.actions;
export default mangaSlice.reducer;

export const selectManga = (state: RootState) => state.manga.manga;
export const selectAllManga = (state: RootState) => state.manga.mangaAll;
export const selectChapters = (state: RootState) => state.manga.manga?.chapters;
export const selectChaptersTranslate = (state: RootState) => state.manga.manga?.chaptersTranslate;
