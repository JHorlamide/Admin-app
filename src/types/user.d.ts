import { IBaseResponse } from "./login";
import { IUserNotification } from "./notifications";
import { IUserWallet } from "./pfas";

type StringOrNull = string | null;

export interface IUser {
  _id: string;
  id: string;
  account_type?: string;
  is_verified: boolean;
  is_locked: boolean;
  is_active: boolean;
  occupation?: StringOrNull;
  nationality?: StringOrNull;
  address: StringOrNull;
  city: StringOrNull;
  state: StringOrNull;
  postal_code: StringOrNull;
  country: StringOrNull;
  identification: StringOrNull;
  identification_number: StringOrNull;
  identification_url: StringOrNull;
  proof_of_address: StringOrNull;
  proof_of_address_url: StringOrNull;
  token: string;
  email: string;
  first_name?: StringOrNull;
  last_name?: StringOrNull;
  middle_name?: StringOrNull;
  name?: StringOrNull;
  entity_name?: StringOrNull;
  phone?: StringOrNull;
  rc_number?: StringOrNull;
  country_of_incorporation?: StringOrNull;
  business_nature?: StringOrNull;
  company?: StringOrNull;
  company_id?: StringOrNull;
  roles?: string[];
  is_sub_account?: boolean;

  notifications?: IUserNotification[];
  wallet: IUserWallet;
}

export interface IUserResponse extends IBaseResponse {
  data: any
};

export interface IUserRequest {
  _id: string;
};

export interface IUserEditResponse extends IBaseResponse {
  data: any;
};

export interface IUserEditRequest {
  user_id: string,
  givenRoles: string[]
};

export interface IUserRemoveRequest {
  user_id: string,
  roles: string[]
};

export interface IUserWalletRequest {
  wallet_id: string;
}

export interface IDeleteUser {
  user_id: string
}

export interface IEditUser {
  roles: string[],
  _id: string
}



export interface User {
  account_type: string;
  address: string;
  business_nature: StringOrNull;
  city: string;
  company: string;
  company_id: StringOrNull;
  country: StringOrNull;
  country_of_incorporation: StringOrNull;
  createdAt: string;
  email: string;
  email_verification_code: string;
  entity_name: StringOrNull
  first_name: string;
  identification: string;
  identification_number: string;
  identification_url: string;
  is_active: boolean
  is_deactivated: boolean
  is_deleted: boolean
  is_locked: boolean
  is_sub_account: boolean
  is_verified: boolean;
  last_login: string
  last_name: string
  login_count: number;
  middle_name: string;
  nationality: string;
  occupation: string;
  phone: string;
  postal_code: string;
  proof_of_address: string;
  proof_of_address_url: string;
  rc_number: string
  roles: string[]
  state: string;
  two_fa_code: StringOrNull;
  updatedAt: string;
  _id: string;
}