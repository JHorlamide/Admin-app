import {
  ILoginRequest,
  ILoginResponse,
  IVerifyLoginRequest,
  IVerifyLoginResponse,
} from "@/types/login";
import { taxitPayApi } from "../apiSlice";

const UMS_BASE_URL = process.env.NEXT_PUBLIC_UMS_SERVICE_URL

export const loginApiSlice = taxitPayApi.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation<ILoginResponse, ILoginRequest>({
      query: (data) => ({
        url: `${UMS_BASE_URL}/auth/login`,
        method: "POST",
        body: data,
      }),
    }),

    verifyLogin: builder.mutation<IVerifyLoginResponse, IVerifyLoginRequest>({
      query: (data) => ({
        url: `${UMS_BASE_URL}/auth/verify-login-2fa`,
        method: "POST",
        body: data,
      }),
    }),
  }),

  overrideExisting: true,
});

export const { useLoginUserMutation, useVerifyLoginMutation } = loginApiSlice;
