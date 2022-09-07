import { IBaseResponse } from "./login";
import { IUser } from "./user";

export interface IGetUserProfileResponse extends IBaseResponse {
  data: IUser;
}

export interface IResendAuthOtpRequest {
  section: string;
  email: string;
}

export interface IUpdateBusinessUser {
  entity_name: string;
  rc_number: string;
  country_of_incorporation: string;
  email: string;
  website: string;
  business_nature: string;
  nationality: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  identification: string;
  identification_number: string;
  proof_of_address: string;
  phone: string;
}

export interface IUpdateBusinessUserRequest {
  entity_name: string;
  phone: string;
  rc_number?: string;
  country_of_incorporation?: string;
  email?: string;
  website?: string;
  business_nature?: string;
  nationality?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  identification?: string;
  identification_number?: string;
  identification_url?: string;
  proof_of_address?: string;
  proof_of_address_url?: string;
}

export interface IUpdateIndividualUser {
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  phone: string;
  occupation: string;
  nationality: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  identification: string;
  identification_number: string;
  proof_of_address: string;
}

export interface IUpdateIndividualUserRequest {
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone: string;
  email?: string;
  occupation?: string;
  nationality?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  identification?: string;
  identification_number?: string;
  identification_url?: string;
  proof_of_address?: string;
  proof_of_address_url?: string;
}

export interface IUpdateUserResponse extends IBaseResponse {
  data: {
    user: IUser;
  };
}
