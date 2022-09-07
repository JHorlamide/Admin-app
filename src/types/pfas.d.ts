import { IBaseResponse } from "./login";
type StringOrNull = string | null;

export interface IPfa {
  name: string;
  pfa_account_name: string;
  pfa_account_number: string
  pfc_name: string;
  pfc_sort_code: StringOrNull;
  updatedAt: string;
  createdAt: string;
  _id: string;
}

export interface IUserWallet {
  available_balance: string;
  ledger_balance: string;
  locked_func: string;
  currency: string;
  two_fa_code: string | null;
  createdAt: string;
  updatedAt: string;
  user_id: string;
  wallet_id: string;
  is_locked: boolean;
}

export interface IBank {
  name: string;
  code: string;
  ussdTemplate: string | null;
  baseUssdCode: string | null;
  transferUssdTemplate: string | null;
}

export interface IGetAllBanksResponse extends IBaseResponse {
  data: {
    banks: IBank[];
  };
}

export interface IValidateAccountNumberRequest {
  accountNumber: string;
  bankCode: string;
}

export interface IValidateAccountNumberResponse extends IBaseResponse {
  data: {
    accountNumber: string;
    accountName: string;
    bankCode: string;
  };
}

export interface IPfaResponse extends IBaseResponse {
  data: any
}

export interface IPfaRequest {
  _id: string;
};


export interface ICreatePfaRequest {
  name: string;
  pfa_account_name: string;
  pfa_account_number: string,
  pfc_name: string,
  pfc_sort_code: string;
}