import { IUser } from "./user";

export interface IBaseResponse {
  code: string;
  message: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse extends IBaseResponse {
  data: null;
}

export interface IVerifyLoginRequest {
  email: string;
  two_fa_code: string;
}

export interface IVerifyLoginResponse extends IBaseResponse {
  data: IUser;
};

