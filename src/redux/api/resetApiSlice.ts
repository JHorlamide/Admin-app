import { IBaseResponse } from "@/types/login";
import {
  IResetPasswordRequest,
  IVerifyResetPasswordOtpRequest,
  IVerifyResetPasswordRequest,
} from "@/types/reset";
import { taxitPayApi } from "../apiSlice";

const UMS_BASE_URL = process.env.NEXT_PUBLIC_UMS_SERVICE_URL;

console.log(UMS_BASE_URL)

export const resetApiSlice = taxitPayApi.injectEndpoints({
  endpoints: (builder) => ({
    resetPassword: builder.mutation<IBaseResponse, IResetPasswordRequest>({
      query: (data) => ({
        url: `${UMS_BASE_URL}/auth/reset-password-email`,
        method: "POST",
        body: data,
      }),
    }),
    verifyResetPasswordOtp: builder.mutation<IBaseResponse, IVerifyResetPasswordOtpRequest>({
      query: (data) => ({
        url: `${UMS_BASE_URL}/auth/otp-verify`,
        method: "POST",
        body: data,
      }),
    }),
    verifyResetPassword: builder.mutation<IBaseResponse, IVerifyResetPasswordRequest>({
      query: (data) => ({
        url: `${UMS_BASE_URL}/auth/reset-password`,
        method: "POST",
        body: data,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useResetPasswordMutation,
  useVerifyResetPasswordMutation,
  useVerifyResetPasswordOtpMutation,
} = resetApiSlice;
