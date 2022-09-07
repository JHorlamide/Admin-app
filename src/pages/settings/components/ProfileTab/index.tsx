import {
  Box,
  Center,
  Container,
  FormControl,
  Heading,
  IconButton,
  InputGroup,
  InputRightElement,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import CustomBtn from '@/components/CustomBtn';
import CustomInput from '@/components/CustomInput';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import LoginInput from '@/pages/login/components/LoginInput';
import { useUpdateUserMutation } from '@/redux/api/profileApiSlice';
import { useVerifyResetPasswordMutation } from '@/redux/api/resetApiSlice';
import { taxitPayApi } from '@/redux/apiSlice';
import { logoutUser } from '@/redux/authSlice';
import {
  businessProfileUpdateSchema,
  individualProfileUpdateSchema,
} from 'src/validation/profile.validation';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import React, { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import capitalize from 'src/helpers/capitalize';

interface IFormValuesIndividual {
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
};

interface IFormValuesBusiness {
  entity_name: string;
  phone: string;
};

const ProfileTab = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialValuesIndividual: IFormValuesIndividual = {
    first_name: user?.first_name || '',
    middle_name: user?.middle_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
  };

  const initialValuesBusiness: IFormValuesBusiness = {
    entity_name: user?.entity_name || '',
    phone: user?.phone || '',
  };

  const [updateUser, { isLoading, isError }] = useUpdateUserMutation();
  const handleUpdate = async (
    values: IFormValuesIndividual,
    actions: FormikHelpers<IFormValuesIndividual>
  ) => {
    try {
      const res = await updateUser({
        first_name: values.first_name,
        last_name: values.last_name,
        phone: values.phone,
        middle_name: values.middle_name,
      }).unwrap();

      toast.success(res?.message);
    } catch (error) {}
  };

  const handleUpdateBusiness = async (
    values: IFormValuesBusiness,
    actions: FormikHelpers<IFormValuesBusiness>
  ) => {
    try {
      const res = await updateUser({
        entity_name: values.entity_name,
        phone: values.phone,
      }).unwrap();

      toast.success(res?.message);

      console.log(values);
    } catch (error) {}
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues: initialValuesIndividual,
      validationSchema: individualProfileUpdateSchema,
      onSubmit: handleUpdate,
    });

  const {
    values: valuesBusiness,
    errors: errorsBusiness,
    touched: touchedBusiness,
    handleChange: handleChangeBusiness,
    handleBlur: handleBlurBusiness,
    handleSubmit: handleSubmitBusiness,
  } = useFormik({
    initialValues: initialValuesBusiness,
    validationSchema: businessProfileUpdateSchema,
    onSubmit: handleUpdateBusiness,
  });

  const [verifyReset, { isLoading: isLoadingReset, isError: isErrorReset }] =
    useVerifyResetPasswordMutation();

  const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await verifyReset({
        email: user?.email,
        password: password.trim(),
      }).unwrap();

      toast.success(res?.message);

      taxitPayApi.util.invalidateTags(['Profile']);
      dispatch(logoutUser());
      router.replace('/');

      setPassword('');
    } catch (error) {}
  };

  return (
    <Box className='profileBox' py={[8, 10]}>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset='slideInBottom'
      >
        <ModalOverlay />
        <ModalContent
          mx={[4, 0]}
          maxW='490'
          w='full'
          bg='white'
          borderRadius='6px'
          className='appBox'
          px={[4, 6, 8]}
          py={[6, 6, 8]}
        >
          <ModalCloseButton />
          <Heading
            as='h3'
            color='textOne'
            fontWeight='600'
            fontSize={['1.2rem', '1.5rem']}
            textAlign='center'
          >
            Set new password
          </Heading>
          <form onSubmit={handleChangePassword}>
            <VStack spacing={[4, 6]} w='full' mt={[4]}>
              <FormControl isRequired>
                <InputGroup>
                  <LoginInput
                    placeholder='Password'
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                  />

                  <InputRightElement height='full'>
                    <IconButton
                      icon={showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      aria-label='toggle password view'
                      bg='transparent'
                      onClick={() => setShowPassword((prev) => !prev)}
                      _hover={{
                        backgroundColor: 'transparent',
                        opacity: '.65',
                      }}
                    />

                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <CustomBtn
                isFullWidth
                mt={[8, 10]}
                disabled={password.length <= 0}
                isLoading={isLoadingReset}
                iserror={isErrorReset}
                type='submit'
              >
                Change password
              </CustomBtn>
            </VStack>
          </form>
        </ModalContent>
      </Modal>

      <Container maxW={'570'}>
        <VStack spacing={[4, 6]} alignItems='flex-start'>
          {user?.account_type === 'individual' && (
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <VStack spacing={[4, 6]} alignItems='flex-start'>
                <CustomInput
                  id='first_name'
                  label='First name'
                  inputProps={{
                    placeholder: 'E.g John',
                    value: values.first_name,
                    onChange: handleChange,
                    onBlur: handleBlur('first_name'),
                    isInvalid:
                      errors.first_name && touched.first_name ? true : false,
                  }}
                  errorText={
                    errors.first_name && touched.first_name
                      ? errors.first_name
                      : null
                  }
                  light
                />

                <CustomInput
                  id='middle_name'
                  label='Middle name (optional)'
                  inputProps={{
                    placeholder: 'E.g Wayne',
                    value: values.middle_name,
                    onChange: handleChange,
                    onBlur: handleBlur('middle_name'),
                    isInvalid:
                      errors.middle_name && touched.middle_name ? true : false,
                  }}
                  errorText={
                    errors.middle_name && touched.middle_name
                      ? errors.middle_name
                      : null
                  }
                  light
                />

                <CustomInput
                  id='last_name'
                  label='Last name'
                  inputProps={{
                    placeholder: 'E.g Bruce',
                    value: values.last_name,
                    onChange: handleChange,
                    onBlur: handleBlur('last_name'),
                    isInvalid:
                      errors.last_name && touched.last_name ? true : false,
                  }}
                  errorText={
                    errors.last_name && touched.last_name
                      ? errors.last_name
                      : null
                  }
                  light
                />

                <CustomInput
                  id='phone'
                  label='Phone number'
                  inputProps={{
                    placeholder: 'E.g 09023808852',
                    value: values.phone,
                    onChange: handleChange,
                    onBlur: handleBlur('phone'),
                    isInvalid: errors.phone && touched.phone ? true : false,
                  }}
                  errorText={
                    errors.phone && touched.phone ? errors.phone : null
                  }
                  light
                />

                <CustomInput
                  label='Email address'
                  id='email'
                  inputProps={{ value: user?.email }}
                  isReadOnly
                  light
                />

                {user?.company && (
                  <>
                    <CustomInput
                      label='Company Name'
                      id='companyName'
                      inputProps={{ value: user?.company }}
                      isReadOnly
                      light
                    />
                  </>
                )}

                <CustomInput
                  label='Occupation'
                  id='occupation'
                  inputProps={{ value: capitalize(user?.occupation) }}
                  isReadOnly
                  light
                />

                <CustomInput
                  label='Address'
                  id='address'
                  inputProps={{ value: capitalize(user?.address) }}
                  isReadOnly
                  light
                />

                <Center mt={[8, 10, 12]} w='full'>
                  <CustomBtn
                    minW={['full', '320']}
                    type='submit'
                    isLoading={isLoading}
                    iserror={isError}
                  >
                    Save
                  </CustomBtn>
                </Center>
              </VStack>
            </form>
          )}

          {user?.account_type !== 'individual' && (
            <form onSubmit={handleSubmitBusiness} style={{ width: '100%' }}>
              <VStack spacing={[4, 6]} alignItems='flex-start'>
                <CustomInput
                  id='entity_name'
                  label='Name'
                  inputProps={{
                    placeholder: 'E.g Wave Holdings',
                    value: valuesBusiness.entity_name,
                    onChange: handleChangeBusiness,
                    onBlur: handleBlurBusiness('entity_name'),
                    isInvalid:
                      errorsBusiness.entity_name && touchedBusiness.entity_name
                        ? true
                        : false,
                  }}
                  errorText={
                    errorsBusiness.entity_name && touchedBusiness.entity_name
                      ? errorsBusiness.entity_name
                      : null
                  }
                  light
                />

                <CustomInput
                  id='phone'
                  label='Phone number'
                  inputProps={{
                    placeholder: 'E.g 09023808852',
                    value: valuesBusiness.phone,
                    onChange: handleChangeBusiness,
                    onBlur: handleBlurBusiness('phone'),
                    isInvalid:
                      errorsBusiness.phone && touchedBusiness.phone
                        ? true
                        : false,
                  }}
                  errorText={
                    errorsBusiness.phone && touchedBusiness.phone
                      ? errorsBusiness.phone
                      : null
                  }
                  light
                />

                <CustomInput
                  label='Email address'
                  id='email'
                  inputProps={{ value: user?.email }}
                  isReadOnly
                  light
                />

                <CustomInput
                  label='RC number'
                  id='rc_number'
                  inputProps={{ value: user?.rc_number }}
                  isReadOnly
                  light
                />

                <CustomInput
                  label='Country of incorporation'
                  id='country_of_incorporation'
                  inputProps={{
                    value: capitalize(user?.country_of_incorporation),
                  }}
                  isReadOnly
                  light
                />

                <CustomInput
                  label='Nature of business'
                  id='business_nature'
                  inputProps={{ value: capitalize(user?.business_nature) }}
                  isReadOnly
                  light
                />

                <CustomInput
                  label='Address'
                  id='address'
                  inputProps={{ value: user?.address }}
                  isReadOnly
                  light
                />

                <Center mt={[8, 10, 12]} w='full'>
                  <CustomBtn
                    minW={['full', '320']}
                    type='submit'
                    isLoading={isLoading}
                    iserror={isError}
                  >
                    Save
                  </CustomBtn>
                </Center>
              </VStack>
            </form>
          )}

          <Center w='full'>
            <CustomBtn
              fontSize={['0.875rem']}
              minW={['full', '320']}
              light
              onClick={onOpen}
            >
              Change Password
            </CustomBtn>
          </Center>
        </VStack>
      </Container>
    </Box>
  );
};

export default ProfileTab;
