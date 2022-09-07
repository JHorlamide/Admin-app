import * as Yup from "yup";

export const individualSignupSchema = Yup.object({
  first_name: Yup.string().trim().required("First name is required"),
  middle_name: Yup.string().trim().required("Middle name is required"),
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
  proof_of_address: Yup.string().trim().required("Proof of address is required"),
  password: Yup.string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .required("password is required"),
  password_confirmation: Yup.string().test(
    "passwords-match",
    "Passwords must match",
    function (value) {
      return this.parent.password === value;
    }
  ),
});

export const corporationSignupSchema = Yup.object({
  entity_name: Yup.string().trim().required("Entity name is required"),
  rc_number: Yup.string().trim().required("Registration number is required"),
  country_of_incorporation: Yup.string().trim().required("Country of incorporation is required"),
  email: Yup.string().trim().email("Invalid email").required("Email is required"),
  website: Yup.string().trim().required("Website is required"),
  business_nature: Yup.string().trim().required("Nature of business is required"),
  nationality: Yup.string().trim().required("Nationality is required"),
  address: Yup.string().trim().required("address is required"),
  city: Yup.string().trim().required("City is required"),
  state: Yup.string().trim().required("State is required"),
  postal_code: Yup.string().trim().required("Postal code is required"),
  country: Yup.string().trim().required("Country is required"),
  identification: Yup.string().trim().required("Identification is required"),
  identification_number: Yup.string().trim().required("Identification number is required"),
  proof_of_address: Yup.string().trim().required("Proof of address is required"),
  phone: Yup.string().trim().required("Phone number is required"),
  password: Yup.string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .required("password is required"),
  password_confirmation: Yup.string().test(
    "passwords-match",
    "Passwords must match",
    function (value) {
      return this.parent.password === value;
    }
  ),
});
