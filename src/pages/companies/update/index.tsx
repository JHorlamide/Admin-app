import {
  Box,
  Modal,
  ModalContent,
  ModalOverlay,
  VStack,
  Heading,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import CustomBtn from '@/components/CustomBtn';
import CustomInput from '@/components/CustomInput';
import { useFormik, FormikHelpers } from 'formik';
import toast from 'react-hot-toast';
import { companyCreateSchema } from 'src/validation/company.validation';
import { useUpdateCompanyMutation } from '@/redux/api/companySlice';
import { ICompany } from '@/types/company';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  companyData: ICompany;
};

const EditCompanyModal = ({ isOpen, onClose, companyData }: Props) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [compId, setCompId] = useState<string>('');

  const [updateCompany, { isLoading, isError }] = useUpdateCompanyMutation();

  useEffect(() => {
    if (compId !== companyData._id) {
      setName(companyData.name);
      setEmail(companyData.email);
      setPhone(companyData.phone);
      setAddress(companyData.address);
      setCompId(companyData._id);
    }
  }, [address, compId, companyData, email, name, phone]);


  const handleUpdateCompany = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await updateCompany({
        name,
        email,
        phone,
        address,
        id: compId,
      }).unwrap();

      if (Number(response.code) === 200) {
        toast.success(response.message);
        onClose();
        clearForm();
        return;
      }

      toast.error(response.message);
    } catch (error) {}
  };

  const clearForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
  };

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
            Update Company Details
          </Heading>

          <form onSubmit={handleUpdateCompany}>
            <VStack mt={[8, 10]} spacing={[4, 6]}>
              <CustomInput
                label='Company Name'
                id='name'
                inputProps={{
                  name: 'name',
                  placeholder: 'Erom Health Limited',
                  value: name ?? '',
                  onChange: (e) => setName(e.target.value),
                  type: 'text',
                }}
                isRequired
              />

              <CustomInput
                label='Company Email'
                id='email'
                inputProps={{
                  name: 'email',
                  placeholder: 'e.g example@outlook.com',
                  value: email ?? '',
                  onChange: (e) => setEmail(e.target.value),
                  type: 'text',
                }}
                isRequired
              />

              <CustomInput
                label='Company Address'
                id='address'
                inputProps={{
                  name: 'address',
                  placeholder: '',
                  value: address,
                  onChange: (e) => setAddress(e.target.value),
                  type: 'text',
                }}
                isRequired
              />

              <CustomInput
                label='Company Phone'
                id='phone'
                inputProps={{
                  name: 'phone',
                  placeholder: 'e.g 09021212121',
                  value: phone,
                  onChange: (e) => setPhone(e.target.value),
                  type: 'number',
                }}
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

export default EditCompanyModal;
