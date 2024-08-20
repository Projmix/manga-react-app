import { Chapters, Manga } from "../../types";
import { api } from "./api";
type MangaData = Omit<Manga, "id">

export const mangaApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllManga: builder.query<Manga[], void>({
      query: () => ({
        url: "/manga",
        method: "GET",
      }),
    }),
    getManga: builder.query<Manga & { chapters: Chapters[] }, string>({
      query: (name) => ({
        url: `/manga/${name}`,
        method: "GET",
      }),
    }),
    editManga: builder.mutation<Manga, Manga>({
      query: (manga) => ({
        url: `/manga/edit/${manga.title}`,
        method: "PUT",
        body: manga
      }),
    }),
    removeManga: builder.mutation<string, Manga>({
      query: (manga) => ({
        url: `/manga/remove/${manga.title}`,
        method: "DELETE",
        body: manga
      }),
    }),
    addManga: builder.mutation<Manga, MangaData>({
      query: (manga) => ({
        url: `/manga/add`,
        method: "POST",
        body: manga
      }),
    }),
  }),
});


export const {
    useGetAllMangaQuery,
    useGetMangaQuery,
    useEditMangaMutation,
    useRemoveMangaMutation,
    useAddMangaMutation,
} = mangaApi

export const {
    endpoints: {
        getAllManga,
        getManga,
        editManga,
        removeManga,
        addManga
    }
} = mangaApi