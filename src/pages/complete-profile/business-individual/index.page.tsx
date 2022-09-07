import CustomBtn from '@/components/CustomBtn';
import CustomInput from '@/components/CustomInput';
import FileUpload from '@/components/FileUpload';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { useUpdateTeamUserMutation } from '@/redux/api/settingsApiSlice';
import { setUser } from '@/redux/authSlice';
import { updateTeamUserSchema } from 'src/validation/profile.validation';
import {
  Box,
  Center,
  Container,
  Heading,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import { FormikHelpers, useFormik } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Layout from '@/components/Layout';

interface IFormValues {
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
}

const CompleteProfileBusinessIndividual: NextPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  
  const initialValues: IFormValues = {
    first_name: '',
    middle_name: '',
    last_name: '',
    phone: '',
  };

  const [updateUser, { isLoading, isError }] = useUpdateTeamUserMutation();

  const handleUpdate = async (
    values: IFormValues,
    actions: FormikHelpers<IFormValues>
  ) => {
    try {
      const res = await updateUser({
        ...values,
      }).unwrap();

      dispatch(setUser(res?.data?.user));
      router.reload();

      actions.resetForm();
    } catch (error) {}
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: updateTeamUserSchema,
      onSubmit: handleUpdate,
    });

  useEffect(() => {
    if (user?.phone) {
      router.replace('/wallet');
    }
  }, [user]);

  return (
    <Layout noHeader>
      <Container maxW='560' h='full' pb={[6, 10]}>
        {user?.first_name || user?.last_name || user?.middle_name ? (
          <Center w='full' h='full'>
            <Spinner size='xl' />
          </Center>
        ) : (
          <Box className='appBox' p={[8, 10]}>
            <Heading
              as='h2'
              color='textOne'
              fontWeight='500'
              fontSize={['1.25rem', '1.25rem']}
            >
              Complete Profile
            </Heading>

            <form style={{ width: '100%' }} onSubmit={handleSubmit}>
              <VStack spacing={[4, 5]} mt={[8, 10]}>
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
                  isRequired
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
                  isRequired
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
                  isRequired
                />
              </VStack>

              <CustomBtn
                mt={[8, 10]}
                isFullWidth
                type='submit'
                isLoading={isLoading}
                iserror={isError}
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

export default CompleteProfileBusinessIndividual;
