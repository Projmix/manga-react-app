import { Chapters } from "../../types";
import { api } from "./api";
type UploadDataUrl = { url: string, selector: string };

export const uploadApi = api.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<string[], FormData>({
      query: (uploadData) => ({
        url: `/upload`,
        method: "POST",
        body: uploadData
      }),
    }),
    uploadUrl: builder.mutation<string[], UploadDataUrl>({
      query: (uploadData) => ({
        url: `/upload/url`,
        method: "POST",
        body: uploadData
                    
      }),
    }),
  }),
});


export const {
    useUploadFileMutation,
    useUploadUrlMutation,
} = uploadApi

export const {
    endpoints: {
      uploadFile,
      uploadUrl,
    }
} = uploadApi