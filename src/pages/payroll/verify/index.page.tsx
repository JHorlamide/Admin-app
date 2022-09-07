import Layout from '@/components/Layout';
import CustomBtn from '@/components/CustomBtn';
import useLeavePageConfirm from '@/hooks/useLeavePageConfirm';
import useTimer from '@/hooks/useTimer';
import { useConfirmApprovePayrollMutation } from '@/redux/api/payrollApiSlice';
import { Box, Container, Heading, Text } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import styles from './Verify.module.scss';
import OtpInput from 'react-otp-input';

const Verify: NextPage = () => {
  const router = useRouter();

  const [otp, setOtp] = useState<string>('');

  const handleOtpChange = (val: string) => {
    setOtp(val);
  };

  const [alertLeave, setAlertLeave] = useState<boolean>(true);
  const [payrollRef, setPayrollRef] = useState<string>('');

  const removePayrollRef = () => {
    sessionStorage.removeItem('tpay_payroll_item_ref');
  };

  useLeavePageConfirm({ isConfirm: alertLeave, action: removePayrollRef });

  const leavePage = () => {
    setAlertLeave(false);
    removePayrollRef();
    router.replace('/payroll');
  };

  const [verifyOtp, { isLoading: isLoadingVerify, isError: isErrorVerify }] =
    useConfirmApprovePayrollMutation();

  const handleVerify = async () => {
    setAlertLeave(false);
    try {
      const res = await verifyOtp({
        salary_id: payrollRef as string,
        payment: 'account',
        otp,
      }).unwrap();

      leavePage();
      toast.success(res?.message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const payrollRef = sessionStorage.getItem('tpay_payroll_item_ref');

    if (!payrollRef) {
      router.replace('/payroll');
      return;
    }

    setPayrollRef(payrollRef);
  }, []);

  const { seconds, reset } = useTimer(60);

  return (
    <Layout>
      <Container maxW='1200'>
        <Container maxW='560' h='full' pt={[6]} pb='0'>
          <Heading
            as='h2'
            color='#textOne'
            fontWeight='500'
            fontSize={['1.25rem']}
            textAlign='center'
          >
            Confirm Payroll Payment
          </Heading>

          <Box my={[4, 6]}>
            <Box bg='white' borderRadius={8} p={[4, 6, 8]} className='appBox'>
              <>
                <Text
                  textAlign='center'
                  color='textFour'
                  fontWeight='500'
                  fontSize={['0.875rem', '1rem']}
                  mt={[4, 6]}
                >
                  ENTER THE OTP SENT TO YOUR EMAIL
                </Text>

                <Box mt='6'>
                  <OtpInput
                    value={otp}
                    onChange={handleOtpChange}
                    numInputs={6}
                    containerStyle={styles.otp_container}
                    inputStyle={styles.otp_input}
                    focusStyle={styles.otp_input_focus}
                    isInputSecure
                  />
                </Box>

                <CustomBtn
                  disabled={otp.length < 6}
                  isFullWidth
                  onClick={handleVerify}
                  mt='6'
                  isLoading={isLoadingVerify}
                  iserror={isErrorVerify}
                >
                  Confirm Transaction
                </CustomBtn>

                <CustomBtn
                  light
                  isFullWidth
                  mt='4'
                  isDisabled={seconds > 0 || isLoadingVerify}
                  // onClick={handleResendOtp}
                  // isLoading={isLoadingOtp}
                >
                  Resend Code{' '}
                  {seconds > 0 ? `00:${seconds <= 9 ? '0' : ''}${seconds}` : ''}
                </CustomBtn>

                <CustomBtn
                  light
                  isFullWidth
                  mt='4'
                  onClick={leavePage}
                  isDisabled={isLoadingVerify}
                >
                  Cancel
                </CustomBtn>
              </>
            </Box>
          </Box>
        </Container>
      </Container>
    </Layout>
  );
};

export default Verify;
