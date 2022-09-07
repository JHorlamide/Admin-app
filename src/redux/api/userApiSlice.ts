import build from 'next/dist/build';
import {
    IUserRequest,
    IUserResponse,
    IUserEditResponse,
    IUserEditRequest,
    IUserRemoveRequest,
    IUserWalletRequest,
    IDeleteUser
} from '../../types/user'

import { taxitPayApi } from '../apiSlice';

const PAYMENT_BASE_URL_ADMIN = process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL_ADMIN;
const UMS_BASE_URL = process.env.NEXT_PUBLIC_UMS_SERVICE_URL;

export const userApiSlice = taxitPayApi.injectEndpoints({
    endpoints: (builder) => ({
        getIndividualUser: builder.query<IUserResponse, void>({
            query: () => `${PAYMENT_BASE_URL_ADMIN}/users?type=individual`,
        }),

        getCorporateUser: builder.query<IUserResponse, void>({
            query: () => `${PAYMENT_BASE_URL_ADMIN}/users?type=corporate`
        }),

        getUserDetails: builder.query<IUserResponse, IUserRequest>({
            query: (data) => `${PAYMENT_BASE_URL_ADMIN}/user?id=${data._id}`
        }),

        getUserTransactions: builder.query<IUserResponse, IUserWalletRequest>({
            query: (data) => `${PAYMENT_BASE_URL_ADMIN}/transactions?ref=${data.wallet_id}`
        }),

        activateUser: builder.mutation<IUserResponse, IUserRequest>({
            query: (data) => ({
                url: `${PAYMENT_BASE_URL_ADMIN}/user/activate/${data._id}`,
                method: 'POST',
                body: data
            })
        }),

        deactivateUser: builder.mutation<IUserResponse, IUserRequest>({
            query: (data) => ({
                url: `${PAYMENT_BASE_URL_ADMIN}/user/deactivate/${data._id}`,
                method: 'POST',
                body: data
            })
        }),

        editUserRole: builder.mutation<IUserEditResponse, IUserEditRequest>({
            query: (data) => ({
                url: `${PAYMENT_BASE_URL_ADMIN}/user/edit-role`,
                method: 'POST',
                body: data
            })
        }),

        removeUserRole: builder.mutation<IUserEditResponse, IUserRemoveRequest>({
            query: (data) => ({
                url: `${PAYMENT_BASE_URL_ADMIN}/user/remove-role`,
                method: 'POST',
                body: data
            })
        }),


        getTotalUser: builder.query<IUserResponse, void>({
            query: () => `${UMS_BASE_URL}/v1/admin/all/users`
        }),
    }),

    overrideExisting: true,
});

export const {
    useGetIndividualUserQuery,
    useGetCorporateUserQuery,
    useGetUserDetailsQuery,
    useGetUserTransactionsQuery,
    useActivateUserMutation,
    useDeactivateUserMutation,
    useEditUserRoleMutation,
    useRemoveUserRoleMutation,
    useGetTotalUserQuery,
} = userApiSlice