import { IBaseResponse } from "../../types/login";
import {
  IGetAllBanksResponse,
  IValidateAccountNumberRequest,
  IValidateAccountNumberResponse,
  IPfaResponse,
  IPfaRequest,
  ICreatePfaRequest
} from "../../types/pfas";
import { taxitPayApi } from "../apiSlice";

const PAYMENT_BASE_URL = process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL;
const PAYMENT_BASE_URL_ADMIN = process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL_ADMIN;

export const pfasApiSlice = taxitPayApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBanks: builder.query<IGetAllBanksResponse, void>({
      query: () => `${PAYMENT_BASE_URL}/wallet/banks/all`,
    }),

    validateAcctNumber: builder.query<
      IValidateAccountNumberResponse,
      IValidateAccountNumberRequest
    >({
      query: (data) =>
        `${PAYMENT_BASE_URL}/wallet/banks/validate?accountNumber=${data.accountNumber}&bankCode=${data.bankCode}`,
      providesTags: ["BankData"],
    }),

    getPfas: builder.query<IPfaResponse, void>({
      query: () => `${PAYMENT_BASE_URL_ADMIN}/pfas`
    }),

    getPfaDetail: builder.query<IPfaResponse, IPfaRequest>({
      query: (data) => `${PAYMENT_BASE_URL_ADMIN}/pfa?id=${data._id}`
    }),

    createPfa: builder.mutation<IPfaResponse, ICreatePfaRequest>({
      query: (data) => ({
        url: `${PAYMENT_BASE_URL_ADMIN}/create-pfa`,
        method: 'POST',
        body: data
      })
    }),

    getAllPfa: builder.query<IPfaResponse, void>({
      query: (data) => `${PAYMENT_BASE_URL_ADMIN}/pfas`
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetAllBanksQuery,
  useValidateAcctNumberQuery,
  useGetPfasQuery,
  useGetPfaDetailQuery,
  useCreatePfaMutation,
  useGetAllPfaQuery
} = pfasApiSlice;
