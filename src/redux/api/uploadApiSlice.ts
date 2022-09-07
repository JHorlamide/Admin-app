import { IUploadRequest, IUploadResponse } from "@/types/upload";
import { taxitPayApi } from "../apiSlice";

const UMS_BASE_URL = process.env.NEXT_PUBLIC_UMS_SERVICE_URL;

export const uploadApiSlice = taxitPayApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<IUploadResponse, FormData>({
      query: (data) => ({
        url: `${UMS_BASE_URL}/upload`,
        method: "POST",
        body: data,
      }),
    }),
  }),

  overrideExisting: true,
});

export const { useUploadFileMutation } = uploadApiSlice;
