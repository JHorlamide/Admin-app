import React from 'react';
import {
  Box,
  Flex,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import TransferDetail from '@/components/TransferDetail';
import numeral from 'numeral';
import dayjs from 'dayjs';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  transactionDetail: any;
};

const index = ({ isOpen, onClose, transactionDetail }: Props) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      motionPreset='slideInBottom'
    >
      <ModalOverlay />
      <ModalContent
        mx={[4, 0]}
        maxW='590'
        w='full'
        bg='white'
        borderRadius='6px'
        className='appBox'
        px={[4, 6, 8]}
        py={[6, 6, 8]}
      >
        <ModalCloseButton />

        <Flex justify='center'>
          <Box>
            <Text
              color='textFour'
              fontWeight='500'
              fontSize={['0.875rem', '1rem']}
              textAlign={['center']}
            >
              Transaction Details
            </Text>
          </Box>
        </Flex>

        <VStack spacing={[3, 4]} mt={[4, 6, 8]}>
          <TransferDetail
            left='Credit'
            right={`₦${numeral(transactionDetail?.credit).format('0,0.00')}`}
          />

          <TransferDetail
            left='Debit'
            right={`₦${numeral(transactionDetail?.debit).format('0,0.00')}`}
          />

          <TransferDetail
            left='Total Credit'
            right={`₦${numeral(transactionDetail?.totalCredit).format('0,0.00')}`}
          />

          <TransferDetail
            left='Total Debit'
            right={`₦${numeral(transactionDetail?.totalDebit).format('0,0.00')}`}
          />
        </VStack>
      </ModalContent>
    </Modal>
  );
};

export default index;
