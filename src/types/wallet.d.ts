import { IBaseResponse } from "./login";

export interface IUserWallet {
  available_balance: string;
  ledger_balance: string;
  locked_fund: string;
  currency: string;
  two_fa_code: string | null;
  createdAt: string;
  updatedAt: string;
  user_id: string;
  wallet_id: string;
  is_locked: boolean;
  createdAt: string;
  updatedAt: string;
  _id: string;
}

export interface IUserTransaction {
  account_details: string | null;
  account_name: string | null;
  account_number: string | null;
  amount_paid: string;
  bank_code: string | null;
  bank_name: string | null;
  card_details: string;
  createdAt: string;
  currency: string;
  customer: string;
  description: string;
  fee: string;
  paid_date: string;
  pay_ref: string;
  payment_method: string;
  payment_type: string;
  reciever: null
  settlement_amount: string;
  status: string;
  trans_ref: string;
  two_fa_code: string | null;
  two_fa_code_verify: boolean;
  updatedAt: string;
  wallet_id: string;
  __v: number;
  _id: string;
}

export interface IBankTransferResponse extends IBaseResponse {
  data: {
    reciever: {
      account_number: string;
      account_name: string;
      bank_name: string;
    };

    transaction: {
      amount: number;
      fee: string;
      total_amount: string;
      trans_ref: string;
    };
  };
};

export interface ITransferResponse extends IBaseResponse {
  data: {
    reciever: {
      account_number?: string;
      account_name?: string;
      bank_name?: string;
      email?: string;
      name?: string;
    };
    transaction: {
      amount: number;
      fee: string;
      total_amount: string;
      trans_ref: string;
    };
  };
};

export interface IWalletTransferResponse extends IBaseResponse {
  data: {
    reciever: {
      email: string;
      name: string;
    };
    transaction: {
      amount: number;
      fee: string;
      total_amount: string;
      trans_ref: string;
    };
  };
};

export interface IBankTransferRequest {
  fee: string;
  amount: string;
  total_amount: string;
  description: string;
  account_number: string;
  account_name: string;
  bank_name: string;
  bank_code: string;
  wallet_id: string;
};


export interface IFundWalletRequest {
  wallet_id: string;
  amount: string;
  transactionReference: string;
};

export interface IGetAllBanksResponse extends IBaseResponse {
  data: {
    banks: IBank[];
  };
};

export interface IGetAllTransactionsRequest {
  wallet_id: string;
};

export interface IGetAllTransactionsResponse extends IBaseResponse {
  data: {
    count: number;
    transactions: IWalletTransaction[];
  };
};

export interface IResendOtpRequest {
  trans_ref: string;
};

export interface IValidateAccountNumberRequest {
  accountNumber: string;
  bankCode: string;
};

export interface IValidateAccountNumberResponse extends IBaseResponse {
  data: {
    accountNumber: string;
    accountName: string;
    bankCode: string;
  };
};

export interface IVerifyTransferRequest {
  trans_ref: string;
  otp: string;
  receiverType: string;
};

export interface IWalletTransferRequest {
  receiver_email: string;
  fee: string;
  amount: string;
  total_amount: string;
  description: string;
  wallet_id: string;
};

export interface IWalletTransferResponse extends IBaseResponse {
  data: {
    reciever: {
      email: string;
      name: string;
    };
    transaction: {
      amount: number;
      fee: string;
      total_amount: string;
      trans_ref: string;
    };
  };
};

export interface IMonnifyWalletBalanceResponse extends IBaseResponse {
  data: {
    availableBalance: number
    ledgerBalance: number
  }
}

export interface ITransactionAmtResponse extends IBaseResponse {
  data: {
    count: {
      credit: number;
      debit: number;
    }
    total: {
      totalDebit: number;
      totalCredit: number;
    }
  }
}

export interface INumberOfTransactionResponse extends IBaseResponse {
  data: {
    count: number
  }
}

export interface ITotalWalletBalance extends IBaseResponse {
  data: {
    totalBalance: number
  }
}