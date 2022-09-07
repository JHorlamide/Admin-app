import CustomBtn from '@/components/CustomBtn';
import TransferDetail from '@/components/TransferDetail';
import { IPaymentLinkResItem } from '@/types/paymentLinks';
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
import dayjs from 'dayjs';
import numeral from 'numeral';
import React from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  paymentItem: IPaymentLinkResItem | undefined;
};

const PaymentItemModal = ({ isOpen, onClose, paymentItem }: Props) => {
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
              AMOUNT PAID
            </Text>

            <Text
              color='textOne'
              fontSize={['1.5rem', '2rem']}
              fontWeight='600'
              textAlign={['center']}
            >
              <Text
                as='span'
                fontWeight='600'
                color='textOne'
                verticalAlign='top'
                fontSize={['0.8rem']}
                position='relative'
                top='4px'
                right='2px'
              >
                NGN
              </Text>
              {numeral(paymentItem?.amount_paid).format('0,0.00')}
            </Text>
          </Box>
        </Flex>

        <VStack spacing={[3, 4]} mt={[4, 6, 8]}>
          <TransferDetail
            left='Link Ref.'
            right={paymentItem?.pay_ref as string}
          />

          <TransferDetail
            left='Payer Email'
            right={
              paymentItem
                ? JSON.parse(paymentItem?.customer as string)?.email
                : 'N/A'
            }
            // right={JSON.parse(paymentItem?.customer as string).email}
          />

          <TransferDetail
            left='Settlement amount'
            right={`₦${numeral(paymentItem?.settlement_amount as string).format(
              '0,0.00'
            )}`}
          />

          <TransferDetail
            left='Fee'
            right={`₦${numeral(paymentItem?.fee as string).format('0,0.00')}`}
          />

          <TransferDetail
            left='Payment Date'
            right={dayjs(paymentItem?.paid_date as string).format(
              'DD MMM, YYYY'
            )}
          />

          <TransferDetail left='Status' right={paymentItem?.status as string} />
        </VStack>

        {paymentItem && paymentItem?.status === 'pending' ? (
          <Box mt={[4, 6]} w='full'>
            <CustomBtn light onClick={onClose} isFullWidth>
              Refund
            </CustomBtn>
          </Box>
        ) : null}
      </ModalContent>
    </Modal>
  );
};

export default PaymentItemModal;
