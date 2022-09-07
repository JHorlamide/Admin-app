import {
    ICompanyResponse,
    ICompanyRequest,
    IUpdateCompRequest,
    IGetCompPension
} from "../../types/company";
import { taxitPayApi } from "../apiSlice";

// const PAYMENT_BASE_URL = process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL;
const PAYMENT_BASE_URL_ADMIN = process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL_ADMIN;

export const companyApiSlice = taxitPayApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllCompany: builder.query<ICompanyResponse, void>({
            query: () => `${PAYMENT_BASE_URL_ADMIN}/companies`,
        }),

        createNewCompany: builder.mutation<ICompanyResponse, ICompanyRequest>({
            query: (data) => ({
                url: `${PAYMENT_BASE_URL_ADMIN}/company/create`,
                method: 'POST',
                body: data
            })
        }),

        updateCompany: builder.mutation<ICompanyResponse, IUpdateCompRequest>({
            query: (data) => ({
                url: `${PAYMENT_BASE_URL_ADMIN}/company/update`,
                method: 'PUT',
                body: data
            })
        }),

        getPensionByCompId: builder.query<ICompanyResponse, IGetCompPension>({
            query: (data) => `${PAYMENT_BASE_URL_ADMIN}/pensions?ref=${data.company_id}`
        })
    }),

    overrideExisting: true,
});

export const {
    useGetAllCompanyQuery,
    useGetPensionByCompIdQuery,
    useCreateNewCompanyMutation,
    useUpdateCompanyMutation
} = companyApiSlice

