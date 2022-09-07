import CustomBtn from "@/components/CustomBtn";
import CustomInput from "@/components/CustomInput";
import FileUpload from "@/components/FileUpload";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { useUpdateUserMutation } from "@/redux/api/profileApiSlice";
import { useUploadFileMutation } from "@/redux/api/uploadApiSlice";
import { setUser } from "@/redux/authSlice";
import { IUpdateIndividualUser } from "@/types/profile";
import { IRegisterIndividualUserRequestWithoutImages } from "@/types/register";
import { individualUpdateSchema } from "src/validation/profile.validation";
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

const CompleteProfileIndividual: NextPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const initialValues: IUpdateIndividualUser = {
    first_name: user?.first_name || "",
    middle_name: user?.middle_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    occupation: user?.occupation || "",
    nationality: user?.nationality || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    postal_code: user?.postal_code || "",
    country: user?.country || "",
    identification: user?.identification || "",
    identification_number: user?.identification_number || "",
    proof_of_address: user?.proof_of_address || "",
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
    values: IUpdateIndividualUser,
    actions: FormikHelpers<IUpdateIndividualUser>
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
      }

      if (!idImageRes && !idImageUrl) return;

      if (!addressImageUrl) {
        const addressForm = new FormData();

        addressForm.append("the_file", addressImage as File);
        addressForm.append("email", values.email);
        addressForm.append("file_type", "proofs");

        addressImageRes = await uploadFile(addressForm).unwrap();
      }

      if (!addressImageRes && addressImageUrl) return;

      const updateRes = await updateUser({
        ...values,
        identification_url: (idImageUrl || idImageRes?.data) as string,
        proof_of_address_url: (addressImageUrl || addressImageRes?.data) as string,
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
    validationSchema: individualUpdateSchema,
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
    if (user?.phone) {
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
        {user?.phone ? (
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
                  id="first_name"
                  label="First name"
                  inputProps={{
                    placeholder: "E.g John",
                    value: values.first_name,
                    onChange: handleChange,
                    onBlur: handleBlur("first_name"),
                    isInvalid: errors.first_name && touched.first_name ? true : false,
                  }}
                  errorText={errors.first_name && touched.first_name ? errors.first_name : null}
                  isRequired
                />
                <CustomInput
                  id="middle_name"
                  label="Middle name (optional)"
                  inputProps={{
                    placeholder: "E.g Wayne",
                    value: values.middle_name,
                    onChange: handleChange,
                    onBlur: handleBlur("middle_name"),
                    isInvalid: errors.middle_name && touched.middle_name ? true : false,
                  }}
                  errorText={errors.middle_name && touched.middle_name ? errors.middle_name : null}
                />
                <CustomInput
                  id="last_name"
                  label="Last name"
                  inputProps={{
                    placeholder: "E.g Bruce",
                    value: values.last_name,
                    onChange: handleChange,
                    onBlur: handleBlur("last_name"),
                    isInvalid: errors.last_name && touched.last_name ? true : false,
                  }}
                  errorText={errors.last_name && touched.last_name ? errors.last_name : null}
                  isRequired
                />
                <CustomInput
                  id="phone"
                  label="Phone number"
                  inputProps={{
                    placeholder: "E.g 09023808852",
                    value: values.phone,
                    onChange: handleChange,
                    onBlur: handleBlur("phone"),
                    isInvalid: errors.phone && touched.phone ? true : false,
                  }}
                  errorText={errors.phone && touched.phone ? errors.phone : null}
                  isRequired
                />
                <CustomInput
                  id="email"
                  label="Email address"
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
                  id="occupation"
                  label="Occupation"
                  inputProps={{
                    placeholder: "Ex. Entrepreneur",
                    value: values.occupation,
                    onChange: handleChange,
                    onBlur: handleBlur("occupation"),
                    isInvalid: errors.occupation && touched.occupation ? true : false,
                  }}
                  errorText={errors.occupation && touched.occupation ? errors.occupation : null}
                  isRequired
                />
                <CustomInput
                  id="nationality"
                  label="Nationality"
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
                  id="address"
                  label="Residential address"
                  inputProps={{
                    placeholder: "Ex. Ikoyi, Lagos",
                    value: values.address,
                    onChange: handleChange,
                    onBlur: handleBlur("address"),
                    isInvalid: errors.address && touched.address ? true : false,
                  }}
                  errorText={errors.address && touched.address ? errors.address : null}
                  isRequired
                />
                <Flex align="flex-start" gap={[4, 6]} w="full">
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
                <Flex align="flex-start" gap={[4, 6]} w="full">
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

export default CompleteProfileIndividual;
