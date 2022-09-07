import { IBaseResponse } from "./login";

export interface IPayslip {
  _id: string;
  payslip_id: string;
  createdAt: string;
  updatedAt: string;
  company_id: {
    entity_name: string;
  };
  month: string;
}

export interface ISlip {
  _id: string;
  employee_designation: string;
  employee_pfa: string;
  employee_rsa_pin: string;
  employer: string;
  gross_basic_allowance: string;
  gross_housing_allowance: string;
  gross_transport_allowance: string;
  gross_dressing_allowance: string;
  gross_leave_allowance: string;
  gross_bonus_allowance: string;
  total_gross: string;
  employer_pension_contribution: string;
  employee_pension_deduction: string;
  employee_voluntary_deduction: string;
  nhf_contribution: string;
  life_insurance: string;
  total_statutory: string;
  loans: string;
  penalties: string;
  total_non_statutory: string;
  consolidated_relief_allowance: string;
  taxable_income: string;
  paye_basic_allowance: string;
  paye_bonus_allowance: string;
  total_tax: string;
  net_salary: string;
  net_bonus: string;
  total_net: string;
  bank_payment: string;
  wallet_payment: string;
  days_worked: string;
  url: string;
  payslip_id: string;
  user_payslip_id: string;
  employee_name: string;
  employee_email: string;
  createdAt: string;
  updatedAt: string;
}

export interface IGetAllPayslipsRes extends IBaseResponse {
  data: {
    count: number;
    payslips: IPayslip[];
  };
}

export interface IGetSinglePayslipRes extends IBaseResponse {
  data: {
    payslip: IPayslip;
    slips: {
      count: number;
      slips: ISlip[];
    };
  };
}

export interface IGetSingleSlipRes extends IBaseResponse {
  data: {
    slip: ISlip;
  };
}
