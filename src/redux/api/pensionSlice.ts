import { IBaseResponse } from "@/types/login";
import {
    IPensionResponse,
    IPensionRequest,
    IDeclinePensionRequest,
    ISendPensionOtpRequest
} from "../../types/pensions";
import { taxitPayApi } from "../apiSlice";

const PAYMENT_BASE_URL = process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL;

export const companyApiSlice = taxitPayApi.injectEndpoints({
    endpoints: (builder) => ({
        createPension: builder.mutation<IPensionResponse, FormData>({
            query: (data) => ({
                url: `${PAYMENT_BASE_URL}/pension/initiate`,
                method: 'POST',
                body: data
            })
        }),

        sendPensionOtp: builder.mutation<IBaseResponse, ISendPensionOtpRequest>({
            query: (data) => ({
                url: `${PAYMENT_BASE_URL}/pension/send-approval-otp`,
                method: "POST",
                body: data,
            }),
        }),

        getAllPension: builder.query<IPensionResponse, void>({
            query: () => `${PAYMENT_BASE_URL}/pension`,
        }),

        declinePension: builder.mutation<IBaseResponse, IDeclinePensionRequest>({
            query: (data) => ({
                url: `${PAYMENT_BASE_URL}/pension/decline`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Pensions", "Profile"],
        }),
    }),

    overrideExisting: true,
});

export const {
    useCreatePensionMutation,
    useGetAllPensionQuery,
    useDeclinePensionMutation,
    useSendPensionOtpMutation
} = companyApiSlice

