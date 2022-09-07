import { IBaseResponse } from "@/types/login";
import { IGetAllPayslipsRes, IGetSinglePayslipRes, IGetSingleSlipRes } from "@/types/payslips";
import { taxitPayApi } from "../apiSlice";

const PAYMENT_BASE_URL = process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL;

export const payslipsApiSlice = taxitPayApi.injectEndpoints({
  endpoints: (builder) => ({
    initiatePayslip: builder.mutation<IBaseResponse, FormData>({
      query: (data) => ({
        url: `${PAYMENT_BASE_URL}/payslip/schedule`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payslips", "Profile"],
    }),
    getAllPayslips: builder.query<IGetAllPayslipsRes, void>({
      query: () => `${PAYMENT_BASE_URL}/payslip`,
      providesTags: ["Payslips"],
    }),
    getSinglePayslip: builder.query<IGetSinglePayslipRes, string>({
      query: (data) => `${PAYMENT_BASE_URL}/payslip/${data}`,
      providesTags: ["Payslips"],
    }),
    getSingleSlip: builder.query<IGetSingleSlipRes, { parent: string; child: string }>({
      query: (data) => `${PAYMENT_BASE_URL}/payslip/${data.parent}/${data.child}`,
      providesTags: ["Payslips"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useInitiatePayslipMutation,
  useGetAllPayslipsQuery,
  useGetSinglePayslipQuery,
  useGetSingleSlipQuery,
} = payslipsApiSlice;
