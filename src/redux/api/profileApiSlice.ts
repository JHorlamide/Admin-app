import { IBaseResponse } from "@/types/login";
import {
  IGetUserProfileResponse,
  IResendAuthOtpRequest,
  IUpdateIndividualUserRequest,
  IUpdateBusinessUserRequest,
  IUpdateUserResponse,
  IUpdateIndividualUser
} from "@/types/profile";
import { taxitPayApi } from "../apiSlice";

const UMS_BASE_URL = process.env.NEXT_PUBLIC_UMS_SERVICE_URL;

export const profileApiSlice = taxitPayApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<IGetUserProfileResponse, void>({
      query: () => `${UMS_BASE_URL}/auth/profile`,
      providesTags: ["Profile"],
      extraOptions: { maxRetries: 0 },
    }),

    resendAuthOtp: builder.mutation<IBaseResponse, IResendAuthOtpRequest>({
      query: (data) => ({
        url: `${UMS_BASE_URL}/auth/resend-otp`,
        method: "POST",
        body: data,
      }),
    }),

    updateUser: builder.mutation<
      IUpdateUserResponse,
      IUpdateBusinessUserRequest | IUpdateIndividualUserRequest
    >({
      query: (data) => ({
        url: `${process.env.NEXT_PUBLIC_UMS_BACKEND_URL}/api/auth/update-users`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),

  overrideExisting: true,
});

export const { useGetUserProfileQuery, useResendAuthOtpMutation, useUpdateUserMutation } = profileApiSlice;
