import { Center, Spinner } from '@chakra-ui/react';

const AppLoader = () => {
  return (
    <Center w='full' h='100vh'>
      <Spinner size='xl' />
    </Center>
  );
};

export default AppLoader;
