import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

export const taxitPayApi = createApi({
  reducerPath: "taxitPayApi",
  tagTypes: [
    "Profile",
    "BankData",
    "Transactions",
    "Pensions",
    "Payslips",
    "Payroll",
    "Links",
    "Team"
  ],
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://ums.taxit.com.ng/api",
    prepareHeaders: async (headers, { getState }) => {
      const isBrowser = typeof window !== undefined;
      const token =
        (getState() as RootState).auth.token ||
        (isBrowser
          ? localStorage.getItem("taxitPayToken") || sessionStorage.getItem("taxitPayToken")
          : null);

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  endpoints: () => ({}),
  // refetchOnFocus: true,
  refetchOnReconnect: true,
});
