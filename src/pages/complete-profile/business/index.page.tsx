import CustomBtn from "@/components/CustomBtn";
import CustomInput from "@/components/CustomInput";
import FileUpload from "@/components/FileUpload";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { useUpdateUserMutation } from "@/redux/api/profileApiSlice";
import { useUploadFileMutation } from "@/redux/api/uploadApiSlice";
import { setUser } from "@/redux/authSlice";
import { IUpdateBusinessUser } from "@/types/profile";
import { IRegisterCorporationUserRequestWithoutImages } from "@/types/register";
import { corporationUpdateSchema } from "src/validation/profile.validation";
import { CheckCircleIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Container,
  Flex,
  Heading,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { FormikHelpers, useFormik } from "formik";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Layout from "@/components/Layout";

const CompleteProfileBusiness: NextPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const initialValues: IUpdateBusinessUser = {
    rc_number: user?.rc_number,
    entity_name: user?.entity_name || "",
    country_of_incorporation: user?.country_of_incorporation || "",
    email: user?.email || "",
    business_nature: user?.business_nature || "",
    website: user?.website || "",
    nationality: user?.nationality || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    postal_code: user?.postal_code || "",
    country: user?.country || "",
    identification: user?.identification || "",
    identification_number: user?.identification_number || "",
    proof_of_address: user?.proof_of_address || "",
    phone: user?.phone || "",
  };

  const { isOpen: isOpenId, onOpen: onOpenId, onClose: onCloseId } = useDisclosure();
  const { isOpen: isOpenAddress, onOpen: onOpenAddress, onClose: onCloseAddress } = useDisclosure();

  const [idImage, setIdImage] = useState<File | undefined>();
  const [addressImage, setAddressImage] = useState<File | undefined>();

  const [idImageUrl, setIdImageUrl] = useState<string>();
  const [addressImageUrl, setAddressImageUrl] = useState<string>();

  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  const selectIdImage = (val: File | undefined) => {
    setIdImage(val);
  };

  const selectAddressImage = (val: File | undefined) => {
    setAddressImage(val);
  };

  const [updateUser, { isLoading, isError }] = useUpdateUserMutation();
  const [uploadFile, { isLoading: isLoadingUpload, isError: isErrorUpload }] =
    useUploadFileMutation();

  const handleUpdate = async (
    values: IUpdateBusinessUser,
    actions: FormikHelpers<IUpdateBusinessUser>
  ) => {
    // setFormSubmitted(true);

    // if ((!idImage && !idImageUrl) || (!addressImage && !addressImageUrl)) return;
    // if (!idImage || !addressImage) {
    //   return;
    // }

    try {
      let idImageRes;
      let addressImageRes;

      if (!idImageUrl) {
        const idForm = new FormData();

        idForm.append("the_file", idImage as File);
        idForm.append("email", values.email);
        idForm.append("file_type", "identity");

        idImageRes = await uploadFile(idForm).unwrap();
      };

      // if (!idImageRes && !idImageUrl) return;

      if (!addressImageUrl) {
        const addressForm = new FormData();
        addressForm.append("the_file", addressImage as File);
        addressForm.append("email", values.email);
        addressForm.append("file_type", "proofs");

        addressImageRes = await uploadFile(addressForm).unwrap();
      };

      // if (!addressImageRes && addressImageUrl) return;

      const updateRes = await updateUser({
        ...values,
        identification_url: (idImageUrl || idImageRes?.data) ?? undefined,
        proof_of_address_url: (addressImageUrl || addressImageRes?.data) ?? undefined,
      }).unwrap();
      toast.success(updateRes?.message);
      selectIdImage(undefined);
      selectAddressImage(undefined);

      // dispatch(setUser(updateRes?.data?.user));
      // router.reload();

      actions.resetForm();
    } catch (error) {}
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues,
    validationSchema: corporationUpdateSchema,
    onSubmit: handleUpdate,
    enableReinitialize: true,
  });

  useEffect(() => {
    if (!user) return;

    if (idImageUrl && addressImageUrl) return;

    if (user.identification_url) setIdImageUrl(user.identification_url);

    if (user.proof_of_address_url) setAddressImageUrl(user.proof_of_address_url);
  }, [user]);

  useEffect(() => {
    if (user?.rc_number) {
      router.replace("/");
    }
  }, [user]);

  return (
    <Layout noHeader>
      <FileUpload isOpen={isOpenId} onClose={onCloseId} file={idImage} selectFile={selectIdImage} />
      <FileUpload
        isOpen={isOpenAddress}
        onClose={onCloseAddress}
        file={addressImage}
        selectFile={selectAddressImage}
      />
      <Container maxW="560" h="full" pb={[6, 10]}>
        {user?.rc_number ? (
          <Center w="full" h="full">
            <Spinner size="xl" />
          </Center>
        ) : (
          <Box className="appBox" p={[8, 10]}>
            <Heading as="h2" color="textOne" fontWeight="500" fontSize={["1.25rem", "1.25rem"]}>
              Complete Profile
            </Heading>

            <form style={{ width: "100%" }} onSubmit={handleSubmit}>
              <VStack spacing={[4, 5]} mt={[8, 10]}>
                <CustomInput
                  id="entity_name"
                  label="Entity name"
                  inputProps={{
                    placeholder: "Ex. Blackbird LLC",
                    value: values.entity_name,
                    onChange: handleChange,
                    onBlur: handleBlur("entity_name"),
                    isInvalid: errors.entity_name && touched.entity_name ? true : false,
                  }}
                  errorText={errors.entity_name && touched.entity_name ? errors.entity_name : null}
                  isRequired
                />
                <CustomInput
                  id="rc_number"
                  label="Registration number"
                  inputProps={{
                    placeholder: "Ex. RC123456",
                    value: values.rc_number,
                    onChange: handleChange,
                    onBlur: handleBlur("rc_number"),
                    isInvalid: errors.rc_number && touched.rc_number ? true : false,
                  }}
                  errorText={errors.rc_number && touched.rc_number ? errors.rc_number : null}
                  isRequired
                />
                <CustomInput
                  id="country_of_incorporation"
                  label="Country of incorporation"
                  aria-label="Choose country of incorporation"
                  select
                  selectOptions={[
                    { label: "Nigeria", value: "nigeria" },
                    { label: "Ghana", value: "ghana" },
                  ]}
                  selectProps={{
                    value: values.country_of_incorporation,
                    onChange: handleChange,
                    onBlur: handleBlur("country_of_incorporation"),
                    isInvalid:
                      errors.country_of_incorporation && touched.country_of_incorporation
                        ? true
                        : false,
                  }}
                  errorText={
                    errors.country_of_incorporation && touched.country_of_incorporation
                      ? errors.country_of_incorporation
                      : null
                  }
                  selectPlaceholder="Choose country"
                  isRequired
                />
                <CustomInput
                  id="email"
                  label="Work email"
                  inputProps={{
                    placeholder: "Ex. chisom@mail.com",
                    value: values.email,
                    onChange: handleChange,
                    onBlur: handleBlur("email"),
                    isInvalid: errors.email && touched.email ? true : false,
                  }}
                  errorText={errors.email && touched.email ? errors.email : null}
                  isRequired
                />
                <CustomInput
                  id="phone"
                  label="Primary phone number"
                  inputProps={{
                    placeholder: "Ex. +2349023808852",
                    value: values.phone,
                    onChange: handleChange,
                    onBlur: handleBlur("phone"),
                    isInvalid: errors.phone && touched.phone ? true : false,
                  }}
                  errorText={errors.phone && touched.phone ? errors.phone : null}
                  isRequired
                />
                <CustomInput
                  id="website"
                  label="Website"
                  inputProps={{
                    placeholder: "Ex. www.blackbird.com",
                    value: values.website,
                    onChange: handleChange,
                    onBlur: handleBlur("website"),
                    isInvalid: errors.website && touched.website ? true : false,
                  }}
                  errorText={errors.website && touched.website ? errors.website : null}
                />
                <CustomInput
                  id="business_nature"
                  label="Nature of business"
                  aria-label="Choose nature of business"
                  select
                  selectOptions={[
                    { label: "Finance", value: "finance" },
                    { label: "Logistics", value: "logistics" },
                  ]}
                  selectProps={{
                    value: values.business_nature,
                    onChange: handleChange,
                    onBlur: handleBlur("business_nature"),
                    isInvalid: errors.business_nature && touched.business_nature ? true : false,
                  }}
                  errorText={
                    errors.business_nature && touched.business_nature
                      ? errors.business_nature
                      : null
                  }
                  selectPlaceholder="Choose nature of business"
                  isRequired
                />
                <CustomInput
                  label="Nationality"
                  id="nationality"
                  inputProps={{
                    placeholder: "Ex. Nigerian",
                    value: values.nationality,
                    onChange: handleChange,
                    onBlur: handleBlur("nationality"),
                    isInvalid: errors.nationality && touched.nationality ? true : false,
                  }}
                  errorText={errors.nationality && touched.nationality ? errors.nationality : null}
                  isRequired
                />
                <CustomInput
                  label="Residential address"
                  id="address"
                  inputProps={{
                    placeholder: "Ex. Ikoyi, Lagos",
                    value: values.address,
                    onChange: handleChange,
                    onBlur: handleBlur("address"),
                    isInvalid: errors.address && touched.address ? true : false,
                  }}
                  errorText={errors.address && touched.address ? errors.address : null}
                />
                <Flex align="center" gap={[4, 6]} w="full">
                  <CustomInput
                    label="City"
                    id="city"
                    inputProps={{
                      placeholder: "Ex. Ikeja",
                      value: values.city,
                      onChange: handleChange,
                      onBlur: handleBlur("city"),
                      isInvalid: errors.city && touched.city ? true : false,
                    }}
                    errorText={errors.city && touched.city ? errors.city : null}
                    isRequired
                  />
                  <CustomInput
                    label="State/Province"
                    id="state"
                    inputProps={{
                      placeholder: "Ex. Lagos",
                      value: values.state,
                      onChange: handleChange,
                      onBlur: handleBlur("state"),
                      isInvalid: errors.state && touched.state ? true : false,
                    }}
                    errorText={errors.state && touched.state ? errors.state : null}
                    isRequired
                  />
                </Flex>
                <Flex align="center" gap={[4, 6]} w="full">
                  <CustomInput
                    label="Postal code"
                    id="postal_code"
                    inputProps={{
                      placeholder: "Ex. 200223",
                      value: values.postal_code,
                      onChange: handleChange,
                      onBlur: handleBlur("postal_code"),
                      isInvalid: errors.postal_code && touched.postal_code ? true : false,
                    }}
                    errorText={
                      errors.postal_code && touched.postal_code ? errors.postal_code : null
                    }
                    isRequired
                  />
                  <CustomInput
                    label="Country"
                    id="country"
                    inputProps={{
                      placeholder: "Ex. Nigeria",
                      value: values.country,
                      onChange: handleChange,
                      onBlur: handleBlur("country"),
                      isInvalid: errors.country && touched.country ? true : false,
                    }}
                    errorText={errors.country && touched.country ? errors.country : null}
                    isRequired
                  />
                </Flex>
                <Box>
                  <CustomInput
                    label="Select means of identification"
                    aria-label="Select means of identification"
                    id="identification"
                    selectProps={{
                      value: values.identification,
                      onChange: handleChange,
                      onBlur: handleBlur("identification"),
                      isInvalid: errors.identification && touched.identification ? true : false,
                    }}
                    errorText={
                      errors.identification && touched.identification ? errors.identification : null
                    }
                    selectOptions={[
                      { label: "NIN", value: "nin" },
                      { label: "Drivers' license", value: "driver's license" },
                      { label: "International Passport", value: "international passport" },
                    ]}
                    select
                    selectPlaceholder="Select ID"
                    isRequired
                  />
                  <Box bg="rgba(37, 221, 100, 0.2)" p="10px" borderRadius="8px" mt="4">
                    <Text fontWeight="600" fontSize="0.825rem" color="rgba(15, 9, 25, 0.8)">
                      If you don’t hold a Nigerian passport, please email a clear selfie with the
                      proof of identity provided.
                    </Text>
                  </Box>
                </Box>
                <Box w="full">
                  <CustomInput
                    label="Identification number"
                    id="identification_number"
                    inputProps={{
                      placeholder: "Ex. 44345324213",
                      value: values.identification_number,
                      onChange: handleChange,
                      onBlur: handleBlur("identification_number"),
                      isInvalid:
                        errors.identification_number && touched.identification_number
                          ? true
                          : false,
                    }}
                    errorText={
                      errors.identification_number && touched.identification_number
                        ? errors.identification_number
                        : null
                    }
                    isRequired
                  />
                  <CustomBtn
                    mt="4"
                    isFullWidth
                    onClick={onOpenId}
                    disabled={idImageUrl ? true : false}
                  >
                    UPLOAD DOCUMENT ID {idImage ? <CheckCircleIcon ml="4" /> : null}
                  </CustomBtn>
                  {formSubmitted && !idImage && !idImageUrl ? (
                    <Text color="#E53E3E" mt="1.5" fontSize={["0.75rem", "0.875rem"]}>
                      Identification image is required
                    </Text>
                  ) : (
                    <></>
                  )}
                </Box>
                <Box>
                  <CustomInput
                    label="Upload Proof of address"
                    id="proof_of_address"
                    selectPlaceholder="Proof of address"
                    selectProps={{
                      value: values.proof_of_address,
                      onChange: handleChange,
                      onBlur: handleBlur("proof_of_address"),
                      isInvalid: errors.proof_of_address && touched.proof_of_address ? true : false,
                    }}
                    errorText={
                      errors.proof_of_address && touched.proof_of_address
                        ? errors.proof_of_address
                        : null
                    }
                    selectOptions={[
                      { label: "Utility bill", value: "utility bill" },
                      { label: "Land use charge", value: "land use charge" },
                      { label: "Bank statement", value: "bank statement" },
                    ]}
                    select
                    // isRequired
                  />
                  <Box bg="rgba(37, 221, 100, 0.2)" p="10px" borderRadius="8px" mt="4">
                    <Text fontWeight="600" fontSize="0.825rem" color="rgba(15, 9, 25, 0.8)">
                      This can be your utility bills, insurance, rates or bank statement of less
                      than 3months.
                    </Text>
                  </Box>
                  <CustomBtn
                    mt="4"
                    isFullWidth
                    onClick={onOpenAddress}
                    disabled={addressImageUrl ? true : false}
                  >
                    UPLOAD PROOF OF ADDRESS {addressImage ? <CheckCircleIcon ml="4" /> : null}
                  </CustomBtn>
                  {formSubmitted && !addressImage && !addressImageUrl ? (
                    <Text color="#E53E3E" mt="1.5" fontSize={["0.75rem", "0.875rem"]}>
                      Proof of address image is required
                    </Text>
                  ) : (
                    <></>
                  )}
                </Box>
              </VStack>

              <CustomBtn
                mt={[8, 10]}
                isFullWidth
                type="submit"
                isLoading={isLoading || isLoadingUpload}
                iserror={isError || isErrorUpload}
              >
                Update profile
              </CustomBtn>
            </form>
          </Box>
        )}
      </Container>
    </Layout>
  );
};

export default CompleteProfileBusiness;
