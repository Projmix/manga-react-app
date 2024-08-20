import { Chapters, ChaptersTranslate } from "../../types";
import { api } from "./api";
type ChaptersData = Omit<Chapters, "id"> & { path: string; };
type ChaptersTranslateData = Omit<ChaptersTranslate, "id"> & { pathManga: string; pathChapter: string; };
type ChapterQueryParams = {
  path: string;
  name: string;
};

export const chaptersMangaApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getChapterManga: builder.query<Chapters[], string>({
      query: (name) => ({
        url: `/manga/${name}`,
        method: "GET",
      }),
    }),
    editChapterManga: builder.mutation<Chapters, ChaptersData>({
      query: (chapter) => ({
        url: `/manga/${chapter.path}/edit/${chapter.name}`,
        method: "PUT",
        body: chapter
      }),
    }),
    removeChapterManga: builder.mutation<{ id: string } | null, ChaptersData>({
      query: (chapter) => ({
        url: `/manga/${chapter.path}/remove/${chapter.name}`,
        method: "DELETE",
        body: chapter
      }),
      transformResponse: (response: { id: string } | null) => response,

    }),
    addChapterManga: builder.mutation<Chapters, ChaptersData>({
      query: (chapter) => ({
        url: `/manga/${chapter.path}/add`,
        method: "POST",
        body: chapter
                    
      }),
    }),
    getTranslateChapterManga: builder.query<ChaptersTranslate[], ChapterQueryParams>({
      query: ({path, name}) => ({
        url: `/manga/${path}/${name}/translate`,
        method: "GET",
      }),
    }),
    addTranslateChapterManga: builder.mutation<ChaptersTranslate, ChaptersTranslateData>({
      query: ({ name, files, chapterId, pathManga, pathChapter }) => ({
        url: `/manga/${pathManga}/${pathChapter}/translate/add`,
        method: "POST",
        body: {
          name,
          files,
          chapterId
        }
                    
      }),
    }),

  }),
});


export const {
    useGetChapterMangaQuery,
    useEditChapterMangaMutation,
    useRemoveChapterMangaMutation,
    useAddChapterMangaMutation,
    useGetTranslateChapterMangaQuery,
    useAddTranslateChapterMangaMutation,
} = chaptersMangaApi

export const {
    endpoints: {
      getChapterManga,
      editChapterManga,
      removeChapterManga,
      addChapterManga,
      getTranslateChapterManga,
      addTranslateChapterManga
    }
} = chaptersMangaApi