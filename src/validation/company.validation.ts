import * as Yup from "yup";

export const companyCreateSchema = Yup.object({
    name: Yup.string().trim().required("Company is required"),
    phone: Yup.string().trim().required('Phone is required'),
    email: Yup.string().trim().required('Email is required'),
    address: Yup.string().trim().required('Address is required')
});
