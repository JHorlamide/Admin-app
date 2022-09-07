import {
  IRegisterCorporationUserRequest,
  IRegisterIndividualUserRequest,
  IRegisterUserResponse,
  IVerifyUserEmailRequest,
  IVerifyUserEmailResponse,
} from "@/types/register";
import { taxitPayApi } from "../apiSlice";

const UMS_BASE_URL = process.env.NEXT_PUBLIC_UMS_SERVICE_URL;

export const registerApiSlice = taxitPayApi.injectEndpoints({
  endpoints: (builder) => ({
    registerIndividualUser: builder.mutation<IRegisterUserResponse, IRegisterIndividualUserRequest>(
      {
        query: (data) => ({
          url: `${UMS_BASE_URL}/auth/register`,
          method: "POST",
          body: data,
        }),
      }
    ),

    registerCorporationUser: builder.mutation<
      IRegisterUserResponse,
      IRegisterCorporationUserRequest
    >({
      query: (data) => ({
        url: `${UMS_BASE_URL}/auth/register`,
        method: "POST",
        body: data,
      }),
    }),

    verifyUserEmail: builder.mutation<
      IVerifyUserEmailResponse,
      IVerifyUserEmailRequest
    >({
      query: (data) => ({
        url: `${UMS_BASE_URL}/auth/verify-email`,
        method: "POST",
        body: data,
      }),
    }),
  }),

  overrideExisting: true,
});

export const {
  useRegisterIndividualUserMutation,
  useRegisterCorporationUserMutation,
  useVerifyUserEmailMutation,
} = registerApiSlice;
