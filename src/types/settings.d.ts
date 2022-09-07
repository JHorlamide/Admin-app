import { IBaseResponse } from "./login";
import { IUser } from "./user";

export type TeamUserType = "initiator" | "approver";

export interface IAddUserToTeamRequest {
  email: string;
  password: string;
  roles: string[];
}

export interface IAddUserToTeamResponse extends IBaseResponse {
  data: IUser;
}

export interface IGetLinkedUsersResponse extends IBaseResponse {
  data: {
    [key: string]: IUser;
  };
}

export interface IUpdateTeamUserRequest {
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
}

export interface IUpdateTeamUserResponse extends IBaseResponse {
  data: {
    user: IUser;
  };
}
