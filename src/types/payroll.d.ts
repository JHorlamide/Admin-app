import { IBaseResponse } from "./login";

export interface IPayrollItem {
  _id: string;
  month: string;
  salary_id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  total_amount: string;
  account_payment: string;
  approvedDate: string;
  paid_amount: string;
  unpaid_amount: string;
  wallet_payment: string;
  company_id: {
    entity_name: string;
  };
  approver: {
    first_name: string | null;
    last_name: string | null;
    middle_name: string | null;
    entity_name?: string | null;
  };
  initiator: {
    first_name: string | null;
    last_name: string | null;
    middle_name: string | null;
    entity_name?: string | null;
  };
}

export interface IPayrollStaffItem {
  _id: string;
  email: string;
  account_number: string;
  bank: string;
  bank_code: string;
  net_pay: string;
  preference: string;
  status: string;
  salary_id: string;
  salary_staff_id: string;
  beneficiary: string;
  createdAt: string;
  updatedAt: string;
}

export interface IGetAllPayrollsResponse extends IBaseResponse {
  data: {
    salary: IPayrollItem[];
  };
}

export interface IGetPayrollItemResponse extends IBaseResponse {
  data: {
    salary: IPayrollItem;
    records: {
      count: number;
      staffs: IPayrollStaffItem[];
    };
  };
}

export interface IGetPayrollItemSlipResponse extends IBaseResponse {
  data: {
    staffs: IPayrollStaffItem;
  };
}

export interface IConfirmApprovePayrollRequest {
  salary_id: string;
  otp: string;
  payment: string;
}

export interface IApprovePayrollRequest {
  salary_id: string;
}
