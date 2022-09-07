export interface IResetPasswordRequest {
    email: string;
}

export interface IVerifyResetPasswordRequest {
    email: string;
    password: string;
}

export interface IVerifyResetPasswordOtpRequest {
    email: string;
    otp: string;
}
