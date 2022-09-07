import { IBaseResponse } from "./login";

type StringOrNull = string | null;

export interface ICompany {
    name: string;
    address: string;
    phone: string;
    email: string;
    _id: string;
}

export interface ICompanyResponse extends IBaseResponse {
    data: any;
};

export interface IGetCompPension {
    company_id: string
};

export type ICompanyRequest = Omit<ICompany, "_id">;

export type IUpdateCompRequest = Pick<ICompany, "id" | "address" | "email" | "name" | "phone">;