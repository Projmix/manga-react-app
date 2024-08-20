import { SettingsTranslate } from "../../types"; // Ensure this matches the fields needed for translation
import { api } from "./api";

interface TranslationResponse {
  translatedImageUrl: string; 
}


export const translateImage = api.injectEndpoints({
  endpoints: (builder) => ({
    translate: builder.mutation<TranslationResponse, { imageUrl: string; settingsTranslate: SettingsTranslate }>({
      query: ({ imageUrl, settingsTranslate }) => ({
        url: `/translate`,
        method: "POST",
        body: {
          url: imageUrl,
          ...settingsTranslate
        },
      }),
    }),
  }),
});

export const { useTranslateMutation } = translateImage;

export const {
  endpoints: { translate },
} = translateImage;
