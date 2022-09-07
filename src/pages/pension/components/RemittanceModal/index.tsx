import { useAppSelector } from '@/hooks/reduxHooks';
import { useSendPensionOtpMutation } from '@/redux/api/pensionSlice';
import { IPensionItem } from '@/types/pensions';
import {
  Heading,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import numeral from 'numeral';
import CustomBtn from 'src/components/CustomBtn';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  pension: IPensionItem | undefined;
  bankAction?: () => Promise<void>;
};

const RemittanceModal = ({ isOpen, onClose, pension, bankAction }: Props) => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [sendOtp, { isLoading, isError }] = useSendPensionOtpMutation();


  const hasFunds =
    Number(user?.wallet?.available_balance) >= Number(pension?.total_amount);

  const payNow = async () => {
    try {
      await sendOtp({
        pension_ref: pension?.pension_ref as string,
        payment_method: 'wallet',
      }).unwrap();

      sessionStorage.setItem(
        'tpay_pension_item_ref',
        pension?.pension_ref as string
      );
      router.push('/pensions/verify');
    } catch (error) {
      console.log(error);
    }
  };

  const btnAction = hasFunds
    ? () => payNow()
    : () => router.push('/wallet/fund');

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
          Choose a payment method
        </Heading>

        {hasFunds ? (
          <></>
        ) : (
          <Text textAlign='center' mt={[4]} color='redOne' fontWeight='600'>
            Insufficient wallet balance: ₦
            {numeral(user?.wallet?.available_balance).format('0,0.00')}
          </Text>
        )}

        <VStack mt={[4]} spacing={[4, 6]}>
          <CustomBtn
            isFullWidth
            onClick={btnAction}
            isLoading={isLoading}
            iserror={isError}
          >
            {hasFunds ? 'Pay Now' : 'Fund Wallet'}
          </CustomBtn>

          <CustomBtn
            light
            isFullWidth
            onClick={bankAction}
            isDisabled={isLoading}
          >
            Direct Bank Transfer
          </CustomBtn>
        </VStack>
      </ModalContent>
    </Modal>
  );
};

export default RemittanceModal;
