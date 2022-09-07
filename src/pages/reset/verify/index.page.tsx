import { NextPage } from 'next';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import { FormEvent, useState, useEffect } from 'react';
import GuestLayout from '@/components/GuestLayout';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useVerifyResetPasswordMutation } from '@/redux/api/resetApiSlice';

const Verify: NextPage = () => {
  const router = useRouter();
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>("");

  const [verifyReset, { isLoading }] = useVerifyResetPasswordMutation();

  const handlePasswordReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password) return;

    try {
      const res = await verifyReset({ email, password }).unwrap();

      toast.success(res?.message);
      router.replace("/login");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (router.query.email) {
      setEmail(router.query.email as string);
    } else {
      router.replace("/reset");
    }
  }, [router.query]);

  return (
    <GuestLayout>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6} w='full'>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Set New Password</Heading>
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
                <FormLabel>Email</FormLabel>
                <Input
                  type='email'
                  value={email}
                  disabled={true}
                />
              </FormControl>

              <FormControl id='email' isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

export default Verify;
