import { NextPage } from 'next';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { FormEvent, useState } from 'react';
import GuestLayout from '@/components/GuestLayout';
import { useResetPasswordMutation } from '@/redux/api/resetApiSlice';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

const Login: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handlePasswordReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    try {
      const res = await resetPassword({ email }).unwrap();

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('tpay_2fa_email', email);
      }

      toast.success(res.message);
      router.push(`/reset/verify-otp?email=${email}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <GuestLayout>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6} w='full'>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Reset Password</Heading>
        </Stack>

        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <form onSubmit={handlePasswordReset}>
            <Stack spacing={4}>
              <FormControl id='email' isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <Stack spacing={10}>
                <Button
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  type='submit'
                  isLoading={isLoading}
                >
                  Reset
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </GuestLayout>
  );
};

export default Login;
