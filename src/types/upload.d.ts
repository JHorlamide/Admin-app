import { IBaseResponse } from "./login";

export interface IUploadRequest extends FormData {
  the_file: File;
  file_type: "identity" | "proofs";
  email: string;
}

export interface IUploadResponse extends IBaseResponse {
  data: string;
}
