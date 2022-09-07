import { IBaseResponse } from "@/types/login";
import {
  IAddUserToTeamRequest,
  IAddUserToTeamResponse,
  IGetLinkedUsersResponse,
  IUpdateTeamUserRequest,
  IUpdateTeamUserResponse,
} from "@/types/settings";
import {
  IUserResponse,
  IDeleteUser,
  IEditUser
} from '../../types/user'
import { taxitPayApi } from "../apiSlice";

const UMS_BASE_URL = process.env.NEXT_PUBLIC_UMS_SERVICE_URL;
const PAYMENT_BASE_URL_ADMIN = process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL_ADMIN;

export const settingsApiSlice = taxitPayApi.injectEndpoints({
  endpoints: (builder) => ({
    addUserToTeam: builder.mutation<IAddUserToTeamResponse, IAddUserToTeamRequest>({
      query: (data) => ({
        url: `${UMS_BASE_URL}/auth/add-user`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Team"],
    }),
    getLinkedUsers: builder.query<IGetLinkedUsersResponse, void>({
      query: () => `${UMS_BASE_URL}/auth/my-users/all`,
      providesTags: ["Team"],
    }),

    updateTeamUser: builder.mutation<IUpdateTeamUserResponse, IUpdateTeamUserRequest>({
      query: (data) => ({
        url: `${UMS_BASE_URL}/auth`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Team"],
    }),

    deleteUser: builder.mutation<IUserResponse, IDeleteUser>({
      query: (data) => ({
        url: `${UMS_BASE_URL}/v1/admin/user/delete/${data.user_id}`,
        method: 'DELETE',
      })
    }),

    editUser: builder.mutation<IUserResponse, IEditUser>({
      query: (data) => ({
        url: `${UMS_BASE_URL}/v1/admin/user/edit-role`,
        method: 'PUT',
        body: data
      })
    }),
  }),
  overrideExisting: true,
});

export const { 
  useAddUserToTeamMutation, 
  useGetLinkedUsersQuery, 
  useUpdateTeamUserMutation, 
  useDeleteUserMutation,
  useEditUserMutation
} = settingsApiSlice;
