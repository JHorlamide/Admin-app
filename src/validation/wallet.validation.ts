import * as Yup from "yup";

export const paymentLinkSchema = Yup.object({
    amount: Yup.string().trim().required("Amount is required"),
    title: Yup.string().trim().required("Title is required"),
    linkType: Yup.string().trim().required("Link type is required"),
    message: Yup.string().trim(),
});

export const walletTransferSchema = Yup.object({
    receiver_email: Yup.string().trim().email("Invalid email").required("Email is required"),
    amount: Yup.string().trim().required("Amount is required"),
    description: Yup.string().trim(),
});

export const accountTransferSchema = Yup.object({
    amount: Yup.string().trim().required("Amount is required"),
    account_number: Yup.string()
        .trim()
        .min(10, "Must be 10 characters")
        .max(10, "Must be 10 characters")
        .required("Account number is required"),
    bank_name: Yup.string().trim().required("Bank is required"),
    description: Yup.string().trim(),
});