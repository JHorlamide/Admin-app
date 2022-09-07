declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_MONNIFY_API_KEY: string;
      NEXT_PUBLIC_MONNIFY_CONTRACT_CODE: string;
      NEXT_PUBLIC_FRONTEND_URL: string;
      NEXT_PUBLIC_PAYMENT_SERVICE_URL: string;
      NEXT_PUBLIC_PAYMENT_SERVICE_URL_ADMIN: string;
      NEXT_PUBLIC_UMS_SERVICE_URL: string;
    }
  }
}

export {}
