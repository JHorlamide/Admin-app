import {
  Box,
  Heading,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
  Grid,
  Select,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import CustomBtn from '@/components/CustomBtn';
import CustomInput from '@/components/CustomInput';
import UploadIcon from '@/components/UploadIcon';
import { remitPensionSchema } from 'src/validation/pension.validation';
import { useCreatePensionMutation } from '@/redux/api/pensionSlice';
import { ICompany } from '@/types/company';
import FileUpload from '@/components/FileUpload';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/hooks/reduxHooks';
import checkUserType from 'src/helpers/checkUserType';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onUploadOpen: () => void;
  isUploadOpen: boolean;
  onUploadClose: () => void;
};

const CreateRemittance = ({
  isOpen,
  onClose,
  onUploadOpen,
  isUploadOpen,
  onUploadClose,
}: Props) => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [description, setDescription] = useState<string>('');
  const [schedule, setSchedule] = useState<File | undefined>();
  const [createPension, { isLoading, isError }] = useCreatePensionMutation();

  const handleRemit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const form = new FormData();
      form.append('pension_schedule', schedule ?? '');
      form.append('description', description);
      form.append(
        'employer',
        checkUserType(user) === 'business' ? user?.entity_name : user?.company
      );

      const response = await createPension(form).unwrap();
      if (Number(response.code) === 201) {
        toast.success(response.message);
        clearForm();
        onClose();
        return;
      }
      toast.error(response.message);
    } catch (error) {
      console.log(error);
    }
  };

  const downloadPensionExample = () => {
    window.open(
      'https://drive.google.com/file/d/1c7nbOR0fvqN0HbVYLsa9hCEXufyOT5K0/view?usp=sharing',
      '_blank'
    );
  };

  const selectSchedule = (val: File | undefined) => {
    setSchedule(val);
  };

  const cancelPensionCreation = () => {
    onClose();
    router.replace('/pension');
  };

  const clearForm = () => {
    setDescription('');
    setSchedule(undefined);
  };

  return (
    <>
      <FileUpload
        isOpen={isUploadOpen}
        onClose={onUploadClose}
        file={schedule}
        selectFile={selectSchedule}
        fileType={['.csv']}
        title='Choose a file to upload(.csv)'
      />

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
            as='h2'
            color='textThree'
            fontWeight='500'
            fontSize={['1.25rem', '1.5rem']}
          >
            New Pension Remittance Task
          </Heading>

          <form onSubmit={handleRemit}>
            <VStack spacing={[4, 5]}>
              <CustomInput
                pt={5}
                id='description'
                label='Description'
                inputProps={{
                  placeholder: 'E.g January Pension',
                  value: description,
                  onChange: (e) => setDescription(e.target.value),
                }}
              />
            </VStack>

            <Box mt={[6, 5]}>
              <Text
                color='greenOne'
                fontSize='1rem'
                cursor='pointer'
                fontWeight='600'
                _hover={{ textDecoration: 'underline' }}
                display='inline'
                onClick={downloadPensionExample}
              >
                Download Schedule Template
              </Text>
            </Box>

            <Box mt={[6, 5]}>
              {schedule ? (
                <Text textAlign='center' mb='2' fontWeight='500'>
                  {schedule.name}
                </Text>
              ) : null}

              <CustomBtn light isFullWidth onClick={onUploadOpen}>
                Upload Schedule <UploadIcon ml='1' />
              </CustomBtn>
            </Box>

            <Grid templateColumns={['1fr', '1fr 1fr']} gap={[4, 3]} mt={[4, 8]}>
              <CustomBtn
                light
                onClick={cancelPensionCreation}
                disabled={isLoading}
              >
                Cancel
              </CustomBtn>

              <CustomBtn
                type='submit'
                disabled={!schedule ? true : false}
                isLoading={isLoading}
                iserror={isError}
              >
                Next
              </CustomBtn>
            </Grid>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateRemittance;
