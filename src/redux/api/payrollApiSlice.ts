import { IBaseResponse } from "@/types/login";
import {
  IApprovePayrollRequest,
  IConfirmApprovePayrollRequest,
  IGetAllPayrollsResponse,
  IGetPayrollItemResponse,
  IGetPayrollItemSlipResponse,
} from "@/types/payroll";
import { taxitPayApi } from "../apiSlice";

const PAYMENT_BASE_URL = process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL;

export const payrollApiSlice = taxitPayApi.injectEndpoints({
  endpoints: (builder) => ({
    initiatePayroll: builder.mutation<IBaseResponse, FormData>({
      query: (data) => ({
        url: `${PAYMENT_BASE_URL}/salary/upload`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payroll", "Profile"],
    }),

    approvePayroll: builder.mutation<IBaseResponse, IApprovePayrollRequest>({
      query: (data) => ({
        url: `${PAYMENT_BASE_URL}/salary/approval/send-otp`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payroll", "Profile"],
    }),

    confirmApprovePayroll: builder.mutation<IBaseResponse, IConfirmApprovePayrollRequest>({
      query: (data) => ({
        url: `${PAYMENT_BASE_URL}/salary/approve`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payroll", "Profile"],
    }),

    getPayrolls: builder.query<IGetAllPayrollsResponse, void>({
      query: () => `${PAYMENT_BASE_URL}/salary`,
      providesTags: ["Payroll"],
    }),

    getPayrollItem: builder.query<IGetPayrollItemResponse, string>({
      query: (data) => `${PAYMENT_BASE_URL}/salary/${data}`,
      providesTags: ["Payroll"],
    }),

    getPayrollItemSlip: builder.query<
      IGetPayrollItemSlipResponse,
      { parent: string; child: string }
    >({
      query: (data) => `${PAYMENT_BASE_URL}/salary/${data.parent}/slip/${data.child}`,
      providesTags: ["Payroll"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useInitiatePayrollMutation,
  useGetPayrollItemQuery,
  useGetPayrollItemSlipQuery,
  useGetPayrollsQuery,
  useApprovePayrollMutation,
  useConfirmApprovePayrollMutation,
} = payrollApiSlice;
