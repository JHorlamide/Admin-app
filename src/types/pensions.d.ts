import { IBaseResponse } from "./login";

export interface IPension {
    name: string;
    address: string;
    phone: string;
    email: string;
    _id: string;
}

export interface IPensionResponse extends IBaseResponse {
    data: any;
};

export interface IPensionRequest {
    pension_schedule: file,
    employer: string;
    description: string;
}


export interface IPensionItem {
    _id: string;
    initiator: {
        _id: string;
        first_name: string;
        last_name: string;
    };
    transaction_fee: string;
    status: string;
    pension_ref: string;
    amount: string;
    total_amount: string;
    createdAt: string;
    updatedAt: string;
    payment_method?: string;
    two_fa_code?: string | null;
    approvedDate?: string;
    approver?: {
        _id: string;
        first_name: string;
        last_name: string;
    };
    employer?: string;
    description: string;
};

export interface IDeclinePensionRequest {
    pension_ref: string;
};

export interface ISendPensionOtpRequest {
    pension_ref: string;
    payment_method: string;
}
