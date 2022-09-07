import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
  Grid,
} from '@chakra-ui/react';
import CustomBtn from '@/components/CustomBtn';
import { useApprovePayrollMutation } from '@/redux/api/payrollApiSlice';
import CustomInput from '@/components/CustomInput';
import { useFormik } from 'formik';
import { remitPensionSchema } from 'src/validation/pension.validation';
import UploadIcon from '@/components/UploadIcon';
import { useRouter } from 'next/router';
import FileUpload from '@/components/FileUpload';
import { IPayrollItem } from '@/types/payroll';
import { useAppSelector } from '@/hooks/reduxHooks';
import PayrollSuccessModal from '../PayrollSuccessModal';
import { useInitiatePayrollMutation } from '@/redux/api/payrollApiSlice';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  payroll: IPayrollItem | undefined;
};

const monthOptions = [
  { label: 'January', value: 'January' },
  { label: 'February', value: 'February' },
  { label: 'March', value: 'March' },
  { label: 'April', value: 'April' },
  { label: 'May', value: 'May' },
  { label: 'June', value: 'June' },
  { label: 'July', value: 'July' },
  { label: 'August', value: 'August' },
  { label: 'September', value: 'September' },
  { label: 'October', value: 'October' },
  { label: 'November', value: 'November' },
  { label: 'December', value: 'December' },
];

const PayrollModal = ({ isOpen, onClose, payroll }: Props) => {
  const user = useAppSelector((state) => state.auth.user);
  const [schedule, setSchedule] = useState<File | undefined>();
  const [month, setMonth] = useState<string>('');
  const router = useRouter();
  const [initiatePayroll, { isLoading, isError }] =
    useInitiatePayrollMutation();

  const {
    isOpen: isUploadOpen,
    onOpen: onUploadOpen,
    onClose: onUploadClose,
  } = useDisclosure();

  const {
    isOpen: isOpenSuccess,
    onOpen: onOpenSuccess,
    onClose: onCloseSuccess,
  } = useDisclosure();

  const handleInitiate = async () => {
    if (!schedule) return;

    console.log("I was clicked");

    try {
      const form = new FormData();
      form.append('salary_schedule', schedule);
      form.append('month', `${month}, ${new Date().getFullYear()}`);

      await initiatePayroll(form).unwrap();

      onOpenSuccess();
      setSchedule(undefined);
      setMonth('');
    } catch (error) {
      console.log(error);
    }
  };

  const selectSchedule = (val: File | undefined) => {
    console.log(['Val: ', val]);
    setSchedule(val);
  };

  const handleSuccessClose = () => {
    onCloseSuccess();
    router.push('/payroll');
  };

  const downloadPayrollExample = () => {
    window.open(
      'https://drive.google.com/file/d/1sVhm6j5PcuZ5igw7TOh1DCxrk4ma0clf/view?usp=sharing',
      '_blank'
    );
  };

  return (
    <>
      <PayrollSuccessModal
        isOpen={isOpenSuccess}
        onClose={handleSuccessClose}
      />

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
            New Payroll Task
          </Heading>

          <VStack spacing={[4, 5]}>
            <CustomInput
              id='month'
              label='Select month'
              aria-label='Select month'
              select
              selectOptions={monthOptions}
              selectProps={{
                value: month,
                onChange: (e) => setMonth(e.target.value),
              }}
              selectPlaceholder='E.g January'
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
              onClick={downloadPayrollExample}
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
              onClick={() => router.replace('/payroll')}
              disabled={isLoading}
            >
              Cancel
            </CustomBtn>
            <CustomBtn
              type='submit'
              disabled={false}
              isLoading={isLoading}
              iserror={isError}
              onClick={handleInitiate}
            >
              Next
            </CustomBtn>
          </Grid>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PayrollModal;
