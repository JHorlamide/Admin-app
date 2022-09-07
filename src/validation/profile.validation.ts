import * as Yup from "yup";

export const updateTeamUserSchema = Yup.object({
  first_name: Yup.string().trim().required("First name is required"),
  middle_name: Yup.string().trim(),
  last_name: Yup.string().trim().required("Last name is required"),
  phone: Yup.string().trim().required("Phone number is required"),
});

export const individualUpdateSchema = Yup.object({
  first_name: Yup.string().trim().required("First name is required"),
  middle_name: Yup.string().trim(),
  last_name: Yup.string().trim().required("Last name is required"),
  email: Yup.string().trim().email("Invalid email").required("Email is required"),
  phone: Yup.string().trim().required("Phone number is required"),
  occupation: Yup.string().trim().required("Occupation is required"),
  nationality: Yup.string().trim().required("Nationality is required"),
  address: Yup.string().trim().required("address is required"),
  city: Yup.string().trim().required("City is required"),
  state: Yup.string().trim().required("State is required"),
  postal_code: Yup.string().trim().required("Postal code is required"),
  country: Yup.string().trim().required("Country is required"),
  identification: Yup.string().trim().required("Identification is required"),
  identification_number: Yup.string().trim().required("Identification number is required"),
  proof_of_address: Yup.string().trim(),
});

export const corporationUpdateSchema = Yup.object({
  entity_name: Yup.string().trim().required("Entity name is required"),
  rc_number: Yup.string().trim().required("Registration number is required"),
  country_of_incorporation: Yup.string().trim().required("Country of incorporation is required"),
  email: Yup.string().trim().email("Invalid email").required("Email is required"),
  website: Yup.string().trim(),
  business_nature: Yup.string().trim().required("Nature of business is required"),
  nationality: Yup.string().trim().required("Nationality is required"),
  address: Yup.string().trim().required("address is required"),
  city: Yup.string().trim().required("City is required"),
  state: Yup.string().trim().required("State is required"),
  postal_code: Yup.string().trim().required("Postal code is required"),
  country: Yup.string().trim().required("Country is required"),
  identification: Yup.string().trim().required("Identification is required"),
  identification_number: Yup.string().trim().required("Identification number is required"),
  proof_of_address: Yup.string().trim(),
  phone: Yup.string().trim().required("Phone number is required"),
});

export const individualProfileUpdateSchema = Yup.object({
  first_name: Yup.string().trim().required("First name is required"),
  middle_name: Yup.string().trim(),
  last_name: Yup.string().trim().required("Last name is required"),
  phone: Yup.string().trim().required("Phone number is required"),
});

export const businessProfileUpdateSchema = Yup.object({
  entity_name: Yup.string().trim().required("Name is required"),
  phone: Yup.string().trim().required("Phone number is required"),
});
