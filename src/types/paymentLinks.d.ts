import { IBaseResponse } from "./login";

export interface ILinkItem {
  is_recurring: boolean;
  is_used?: boolean;
  _id: string;
  owner: string;
  title: string;
  description: string;
  amount: string;
  payment_link_reference: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPaymentLinkResItem {
  trans_ref: string;
  pay_ref: string;
  amount_paid: string;
  settlement_amount: string;
  fee: string;
  paid_date: string;
  status: string;
  description: string;
  currency: string;
  payment_method: string;
  reciever: string | null;
  bank_name: string | null;
  bank_code: string | null;
  account_name: string | null;
  account_number: string | null;
  card_details: string | null;
  customer: string;
  payment_type: "credit";
  two_fa_code: string | null;
  two_fa_code_verify: boolean;
  _id: string;
  wallet_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IGeneratePaymentLinkRequest {
  title: string;
  description: string;
  amount: string;
  is_recurring: boolean;
}

export interface IGeneratePaymentLinkResponse extends IBaseResponse {
  data: {
    link: ILinkItem;
  };
}

export interface IMakePaymentRequest {
  body: {
    transactionReference: string;
    amount: string;
    link_ref: string;
  };
  walletId: string;
}

export interface IGetAllPaymentLinksResponse extends IBaseResponse {
  data: {
    count: number;
    links: ILinkItem[];
  };
}

export interface IGetPaymentLinkByRefResponse extends IBaseResponse {
  data: {
    link: ILinkItem;
    ownerWallet: {
      id: string;
      wallet_id: string;
      currency: string;
    };
  };
}

export interface IGetPaymentByLinkResponse extends IBaseResponse {
  data: {
    payments: IPaymentLinkResItem[];
  };
}
