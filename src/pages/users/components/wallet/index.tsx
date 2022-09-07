import React, { useMemo } from 'react';
import numeral from 'numeral';
import {
  Heading,
  Modal,
  ModalContent,
  ModalOverlay,
  Flex,
  Text,
  VStack,
  Grid,
} from '@chakra-ui/react';
import { IUserWallet } from '../../../../types/wallet';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  wallet_details: IUserWallet;
};

const Wallet = ({ isOpen, onClose, wallet_details }: Props) => {
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
        maxW='490'
        w='full'
        bg='white'
        borderRadius='6px'
        className='appBox'
        px={[4, 6, 8]}
        py={[6, 6, 8]}
      >
        <Heading
          as='h3'
          color='textOne'
          fontWeight='600'
          fontSize={['1.2rem', '1.5rem']}
          textAlign='center'
        >
          User wallet details
        </Heading>

        <Grid templateColumns={['1fr']} gridGap='4' mt='4'>
          <Flex
            align='center'
            justify='space-between'
            bg='#f1f1f1'
            borderRadius='12px'
            px='6'
            py='4'
            w='full'
          >
            <Text
              color='textFour'
              fontWeight='500'
              fontSize={['0.75rem', '1rem']}
              textTransform='capitalize'
            >
              Available Balance:
            </Text>

            <Text
              color='textFour'
              fontWeight='500'
              fontSize={['0.75rem', '1rem']}
              textTransform='capitalize'
            >
              {wallet_details?.currency}{' '}
              {numeral(Number(wallet_details?.available_balance)).format(
                '0,0.00'
              )}
            </Text>
          </Flex>

          <Flex
            align='center'
            justify='space-between'
            bg='#f1f1f1'
            borderRadius='12px'
            px='6'
            py='4'
            w='full'
          >
            <Text
              color='textFour'
              fontWeight='500'
              fontSize={['0.75rem', '1rem']}
              textTransform='capitalize'
            >
              Ledger Balance:
            </Text>

            <Text
              color='textFour'
              fontWeight='500'
              fontSize={['0.75rem', '1rem']}
              textTransform='capitalize'
            >
              {wallet_details?.currency}{' '}
              {numeral(Number(wallet_details?.ledger_balance)).format('0,0.00')}
            </Text>
          </Flex>

          <Flex
            align='center'
            justify='space-between'
            bg='#f1f1f1'
            borderRadius='12px'
            px='6'
            py='4'
            w='full'
          >
            <Text
              color='textFour'
              fontWeight='500'
              fontSize={['0.75rem', '1rem']}
              textTransform='capitalize'
            >
              Locked Fund:
            </Text>

            <Text
              color='textFour'
              fontWeight='500'
              fontSize={['0.75rem', '1rem']}
              textTransform='capitalize'
            >
              {wallet_details?.currency}{' '}
              {numeral(Number(wallet_details?.locked_fund)).format('0,0.00')}
            </Text>
          </Flex>

          <Flex
            align='center'
            justify='space-between'
            bg='#f1f1f1'
            borderRadius='12px'
            px='6'
            py='4'
            w='full'
          >
            <Text
              color='textFour'
              fontWeight='500'
              fontSize={['0.75rem', '1rem']}
              textTransform='capitalize'
            >
              Account Locked:
            </Text>

            <Text
              color='textFour'
              fontWeight='500'
              fontSize={['0.75rem', '1rem']}
              textTransform='capitalize'
            >
              {wallet_details?.is_locked ? 'Yes' : 'No'}
            </Text>
          </Flex>
        </Grid>
      </ModalContent>
    </Modal>
  );
};

export default Wallet;
