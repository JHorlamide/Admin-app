import { IBaseResponse } from "./login";
import { IUser } from "./user";

export interface IRegisterIndividualUserRequestWithoutImages {
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
  password: string;
}

export interface IRegisterCorporationUserRequestWithoutImages {
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
  password: string;
  phone: string;
}

export interface IRegisterIndividualUserRequest
  extends IRegisterIndividualUserRequestWithoutImages {
  identification_url: string;
  proof_of_address_url: string;
  account_type: "individual" | "corporate";
}

export interface IRegisterCorporationUserRequest
  extends IRegisterCorporationUserRequestWithoutImages {
  identification_url: string;
  proof_of_address_url: string;
  account_type: "individual" | "corporate";
}

export interface IRegisterUserResponse extends IBaseResponse {
  data: null;
}

export interface IVerifyUserEmailRequest {
  otp: string;
  email: string;
}

export interface IVerifyUserEmailResponse extends IBaseResponse {
  data: IUser;
}
