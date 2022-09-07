import { IBaseResponse } from "@/types/login";
import { IUserResponse } from "@/types/user";

import {
  IBankTransferRequest,
  IBankTransferResponse,
  IFundWalletRequest,
  IGetAllBanksResponse,
  IGetAllTransactionsRequest,
  IGetAllTransactionsResponse,
  IResendOtpRequest,
  IValidateAccountNumberRequest,
  IValidateAccountNumberResponse,
  IVerifyTransferRequest,
  IWalletTransferRequest,
  IWalletTransferResponse,
  IMonnifyWalletBalanceResponse,
  INumberOfTransactionResponse,
  ITransactionAmtResponse,
  ITotalWalletBalance
} from "@/types/wallet";
import { taxitPayApi } from "../apiSlice";

const PAYMENT_BASE_URL = process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL;
const PAYMENT_BASE_URL_ADMIN = process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL_ADMIN;

export const walletApiSlice = taxitPayApi.injectEndpoints({
  endpoints: (builder) => ({
    fundWallet: builder.mutation<IBaseResponse, IFundWalletRequest>({
      query: (data) => ({
        url: `${PAYMENT_BASE_URL}/wallet/add-fund/${data.wallet_id}`,
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Profile", "Transactions"],
    }),

    walletTransfer: builder.mutation<IWalletTransferResponse, IWalletTransferRequest>({
      query: (data) => ({
        url: `${PAYMENT_BASE_URL}/wallet/transfer/to-wallet/${data.wallet_id}`,
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Profile", "Transactions"],
    }),

    bankTransfer: builder.mutation<IBankTransferResponse, IBankTransferRequest>({
      query: (data) => ({
        url: `${PAYMENT_BASE_URL}/wallet/transfer/to-bank/${data.wallet_id}`,
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Profile", "Transactions"],
    }),

    verifyTransfer: builder.mutation<IBaseResponse, IVerifyTransferRequest>({
      query: (data) => ({
        url: `${PAYMENT_BASE_URL}/api/wallet/transfer/verify`,
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Profile", "Transactions"],
    }),

    resendOtp: builder.mutation<IBaseResponse, IResendOtpRequest>({
      query: (data) => ({
        url: `${PAYMENT_BASE_URL}/wallet/transfer/resend-otp`,
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Profile", "Transactions"],
    }),

    getAllBanks: builder.query<IGetAllBanksResponse, void>({
      query: () => `${PAYMENT_BASE_URL}/wallet/banks/all`,
    }),

    getAllTransactions: builder.query<IGetAllTransactionsResponse, IGetAllTransactionsRequest>({
      query: (data) => `${PAYMENT_BASE_URL}/wallet/transactions/${data.wallet_id}`,
      providesTags: ["Transactions"],
      extraOptions: { maxRetries: 0 },
    }),

    validateAcctNumber: builder.query<
      IValidateAccountNumberResponse,
      IValidateAccountNumberRequest
    >({
      query: (data) =>
        `${PAYMENT_BASE_URL}/wallet/banks/validate?accountNumber=${data.accountNumber}&bankCode=${data.bankCode}`,
    }),

    getMonnifyWalletBalance: builder.query<IMonnifyWalletBalanceResponse, void>({
      query: () => `${PAYMENT_BASE_URL_ADMIN}/monnify/balance`,
    }),

    getAmountOfTransactions: builder.query<ITransactionAmtResponse, void>({
      query: () => `${PAYMENT_BASE_URL_ADMIN}/transactions/credit-debit`,
    }),

    getTotalNumberOfTransaction: builder.query<INumberOfTransactionResponse, void>({
      query: () => `${PAYMENT_BASE_URL_ADMIN}/transactions/all`,
    }),

    getTotalWalletBalance: builder.query<ITotalWalletBalance, void>({
      query: () => `${PAYMENT_BASE_URL_ADMIN}/wallet/balance`,
    }),
  }),

  overrideExisting: true,
});
export const {
  useFundWalletMutation,
  useWalletTransferMutation,
  useBankTransferMutation,
  useVerifyTransferMutation,
  useGetAllBanksQuery,
  useValidateAcctNumberQuery,
  useResendOtpMutation,
  useGetAllTransactionsQuery,
  useGetMonnifyWalletBalanceQuery,
  useGetAmountOfTransactionsQuery,
  useGetTotalNumberOfTransactionQuery,
  useGetTotalWalletBalanceQuery,
} = walletApiSlice;
