import GuestLayout from '@/components/GuestLayout';
import { useAppDispatch } from '@/hooks/reduxHooks';
import useTimer from '@/hooks/useTimer';
import { useVerifyLoginMutation } from '@/redux/api/loginApiSlice';
import { setToken, setUser } from '@/redux/authSlice';
import { setWallet } from '@/redux/walletSlice';
import {
  Box,
  Button,
  Heading,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useResendAuthOtpMutation } from '@/redux/api/profileApiSlice';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import OtpInput from 'react-otp-input';
import styles from './Verify.module.scss';
import CustomBtn from '@/components/CustomBtn';

const Verify: NextPage = () => {
  const [otp, setOtp] = useState<string>('');

  const handleOtpChange = (val: string) => {
    setOtp(val);
  };

  const [pageLoaded, setPageLoaded] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);
  const [verifyLogin, { isLoading }] = useVerifyLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleVerifyLogin = async () => {
    if (otp.length < 4) return;

    try {
      const res = await verifyLogin({
        email: email as string,
        two_fa_code: otp.toUpperCase(),
      }).unwrap();
      
      toast.success(res.message);

      dispatch(setUser(res.data));
      dispatch(setToken(res.data.token));
      dispatch(setWallet(res.data.wallet));

      if (typeof window !== 'undefined') {
        if (sessionStorage.getItem('tpay_admin_remember_me')) {
          localStorage.setItem('taxitPayToken', res.data.token);
        } else {
          sessionStorage.setItem('taxitPayToken', res.data.token);
        }
      };

      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('tpay_2fa_email');
        sessionStorage.removeItem('tpay_admin_remember_me');
      };
    } catch (error) {
      console.log(error);
    };
  };

  useEffect(() => {
    if (typeof window !== undefined) {
      setEmail(sessionStorage.getItem('tpay_2fa_email'));
    };

    setPageLoaded(true);
  }, []);

  useEffect(() => {
    if (!email && pageLoaded) router.replace('/login');
  }, [email]);

  const { seconds, reset } = useTimer(60);
  const [resendOtp, { isLoading: isLoadingOtp, isError: isErrorOtp }] =
    useResendAuthOtpMutation();

  const handleResendAuthOtp = async () => {
    try {
      const res = await resendOtp({
        section: 'login',
        email: email as string,
      }).unwrap();

      toast.success('OTP sent to your email');
      reset();
    } catch (error) {}
  };

  return (
    <GuestLayout>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>ENTER 2FA CODE</Heading>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}
            w='full'
          >
            <Box>
              <OtpInput
                value={otp}
                onChange={handleOtpChange}
                numInputs={4}
                containerStyle={styles.otp_container}
                inputStyle={styles.otp_input}
                focusStyle={styles.otp_input_focus}
                isInputSecure
              />
            </Box>

            <Button
              isFullWidth
              mt='8'
              bg='green.500'
              color='white'
              isDisabled={otp.length < 4}
              isLoading={isLoading}
              onClick={handleVerifyLogin}
            >
              Submit
            </Button>

            <CustomBtn
              light
              isFullWidth
              mt='4'
              isDisabled={seconds > 0}
              onClick={handleResendAuthOtp}
              isLoading={isLoadingOtp}
              iserror={isErrorOtp}
            >
              RESEND CODE{' '}
              {seconds > 0 ? `00:${seconds <= 9 ? '0' : ''}${seconds}` : ''}
            </CustomBtn>
          </Box>
        </Stack>
      </Stack>
    </GuestLayout>
  );
};

export default Verify;
