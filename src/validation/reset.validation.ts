import * as Yup from "yup";

export const resetPasswordSchema = Yup.object({
    email: Yup.string().trim().email("Invalid email").required("Email is required"),
});

export const verifyResetPasswordSchema = Yup.object({
    password: Yup.string()
        .trim()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});
