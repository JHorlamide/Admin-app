import {
  Box,
  Modal,
  ModalContent,
  ModalOverlay,
  VStack,
  Heading,
} from '@chakra-ui/react';
import React from 'react';
import CustomBtn from '@/components/CustomBtn';
import CustomInput from '@/components/CustomInput';
import { useFormik, FormikHelpers } from 'formik';
import toast from 'react-hot-toast';
import { companyCreateSchema } from 'src/validation/company.validation';
import { useCreateNewCompanyMutation } from '@/redux/api/companySlice';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

interface IFormValues {
  name: string;
  address: string;
  phone: string;
  email: string;
}

const CreateCompanyModal = ({ isOpen, onClose }: Props) => {
  const initialValues: IFormValues = {
    name: '',
    address: '',
    phone: '',
    email: '',
  };

  const [createCompany, { isLoading, isError }] = useCreateNewCompanyMutation();

  const onSubmit = async (
    value: IFormValues,
    action: FormikHelpers<IFormValues>
  ) => {
    try {
      const response = await createCompany(value).unwrap();

      if (Number(response.code) === 201) {
        toast.success(response.message);
        onClose();
        action.resetForm();
        return;
      }

      toast.error(response.message);
    } catch (error) {
      console.log(error);
    }
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: companyCreateSchema,
      onSubmit: onSubmit,
    });
  return (
    <Box>
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
          <Heading
            as='h3'
            color='textOne'
            fontWeight='600'
            fontSize={['1.2rem', '1.5rem']}
            textAlign='center'
          >
            Create Company
          </Heading>

          <form onSubmit={handleSubmit}>
            <VStack mt={[8, 10]} spacing={[4, 6]}>
              <CustomInput
                label='Company Name'
                id='name'
                inputProps={{
                  placeholder: 'Erom Health Limited',
                  value: values.name,
                  onChange: handleChange,
                  onBlur: handleBlur('name'),
                  isInvalid: errors.name && touched.name ? true : false,
                  type: 'text',
                }}
                errorText={errors.name && touched.name ? errors.name : null}
                isRequired
              />

              <CustomInput
                label='Company Email'
                id='email'
                inputProps={{
                  placeholder: 'e.g example@outlook.com',
                  value: values.email,
                  onChange: handleChange,
                  onBlur: handleBlur('email'),
                  isInvalid: errors.email && touched.email ? true : false,
                  type: 'text',
                }}
                errorText={errors.email && touched.email ? errors.email : null}
                isRequired
              />

              <CustomInput
                label='Company Address'
                id='address'
                inputProps={{
                  placeholder: '',
                  value: values.address,
                  onChange: handleChange,
                  onBlur: handleBlur('address'),
                  isInvalid: errors.address && touched.address ? true : false,
                  type: 'text',
                }}
                errorText={
                  errors.address && touched.address ? errors.address : null
                }
                isRequired
              />

              <CustomInput
                label='Company Phone'
                id='phone'
                inputProps={{
                  placeholder: 'e.g 09021212121',
                  value: values.phone,
                  onChange: handleChange,
                  onBlur: handleBlur('phone'),
                  isInvalid: errors.phone && touched.phone ? true : false,
                  type: 'number',
                }}
                errorText={errors.phone && touched.phone ? errors.phone : null}
                isRequired
              />

              <CustomBtn
                type='submit'
                isFullWidth
                iserror={isError}
                isLoading={isLoading}
              >
                Submit
              </CustomBtn>
            </VStack>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CreateCompanyModal;
