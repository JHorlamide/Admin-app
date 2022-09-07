import { useAppSelector } from '@/hooks/reduxHooks';
import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { ColorModeSwitcher } from './ColorModeSwitcher';

const GuestLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  if (user) {
    router.replace('/');
  }

  return (
    <>
      <Head>
        <title>TaxitPay Admin</title>
      </Head>

      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}
        position='relative'
      >
        {/* <Box position="absolute" top="8">
          <ColorModeSwitcher />
        </Box> */}
        {children}
      </Flex>
    </>
  );
};

export default GuestLayout;
