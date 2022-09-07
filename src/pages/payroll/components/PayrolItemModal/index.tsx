import CustomBtn from '@/components/CustomBtn';
import PensionTableItem from '@/components/TransactionTableItem';
import { useAppSelector } from '@/hooks/reduxHooks';
import { IPayrollItem } from '@/types/payroll';
import { IPensionItem } from '@/types/pensions';
import {
  Box,
  Flex,
  Grid,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import numeral from 'numeral';
import checkUserRole from 'src/helpers/checkUserRole';
import checkUserType from 'src/helpers/checkUserType';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  payroll: IPayrollItem | undefined;
  approveAction: () => void;
  rejectAction: (val: string) => Promise<void>;
  rejectLoading: boolean;
  rejectError: boolean;
};

const PayrollItemModal = ({
  isOpen,
  onClose,
  payroll,
  approveAction,
  rejectAction,
  rejectLoading,
  rejectError,
}: Props) => {
  const user = useAppSelector((state) => state.auth.user);

  const router = useRouter();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      motionPreset='slideInBottom'
      scrollBehavior='outside'
    >
      <ModalOverlay />
      <ModalContent
        mx={[4, 0]}
        maxW='590'
        // maxH="820"
        w='full'
        bg='white'
        borderRadius='6px'
        className='appBox'
        px={[4, 6, 8]}
        py={[6, 6, 8]}
        // overflow="scroll"
      >
        <ModalCloseButton />
        <Box
          display={['flex', 'block']}
          flexDirection='column'
          justifyContent='center'
        >
          <Text
            color='textFour'
            fontWeight='500'
            fontSize={['0.875rem']}
            textAlign='center'
          >
            TOTAL AMOUNT
          </Text>
          <Text
            color='textOne'
            fontSize={['1.5rem']}
            fontWeight='600'
            textAlign='center'
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
            {numeral(payroll?.total_amount).format('0,0.00')}
          </Text>
        </Box>

        <Flex w='full' align='center' justify='space-between' mt={[6, 8]}>
          <Text
            color='textOne'
            fontWeight='600'
            fontSize={['0.875rem']}
            py='1'
            px='3'
            bg='#e8e8e8'
            borderRadius='8px'
          >
            PENSION STATUS
          </Text>
          <PensionTableItem value={payroll?.status as string} />
        </Flex>

        <VStack mt={[6, 8]} spacing={4}>
          <Flex
            align='center'
            justify='space-between'
            w='full'
            bg='#f1f1f1'
            borderRadius='12px'
            px='5'
            py='4'
          >
            <Text
              color='textFour'
              fontWeight='500'
              fontSize={['0.875rem', '1rem']}
            >
              Initiator
            </Text>
            <Text color='textSix' fontWeight='500'>
              {payroll?.initiator?.entity_name ??
                `${payroll?.initiator?.first_name} ${payroll?.initiator?.middle_name} ${payroll?.initiator?.last_name}`}
            </Text>
          </Flex>

          {payroll?.approver ? (
            <Flex
              align='center'
              justify='space-between'
              w='full'
              bg='#f1f1f1'
              borderRadius='12px'
              px='5'
              py='4'
            >
              <Text
                color='textFour'
                fontWeight='500'
                fontSize={['0.875rem', '1rem']}
              >
                Approver
              </Text>

              <Text color='textSix' fontWeight='500'>
                {payroll?.approver?.entity_name ??
                  `${payroll?.approver?.first_name} ${payroll?.approver?.middle_name} ${payroll?.approver?.last_name}`}
              </Text>
            </Flex>
          ) : null}

          <Flex
            align='center'
            justify='space-between'
            w='full'
            bg='#f1f1f1'
            borderRadius='12px'
            px='5'
            py='4'
          >
            <Text
              color='textFour'
              fontWeight='500'
              fontSize={['0.875rem', '1rem']}
            >
              Payroll ID
            </Text>
            <Text color='textSix' fontWeight='500'>
              {payroll?.salary_id}
            </Text>
          </Flex>

          <Flex
            align='center'
            justify='space-between'
            w='full'
            bg='#f1f1f1'
            borderRadius='12px'
            px='5'
            py='4'
          >
            <Text
              color='textFour'
              fontWeight='500'
              fontSize={['0.875rem', '1rem']}
            >
              Company name
            </Text>
            <Text color='textSix' fontWeight='500'>
              {payroll?.company_id?.entity_name}
            </Text>
          </Flex>

          <Flex
            align='center'
            justify='space-between'
            w='full'
            bg='#f1f1f1'
            borderRadius='12px'
            px='5'
            py='4'
          >
            <Text
              color='textFour'
              fontWeight='500'
              fontSize={['0.875rem', '1rem']}
            >
              Amount
            </Text>
            <Text color='textSix' fontWeight='500'>
              ₦{numeral(payroll?.total_amount).format('0,0.00')}
            </Text>
          </Flex>

          <Flex
            align='center'
            justify='space-between'
            w='full'
            bg='#f1f1f1'
            borderRadius='12px'
            px='5'
            py='4'
          >
            <Text
              color='textFour'
              fontWeight='500'
              fontSize={['0.875rem', '1rem']}
            >
              Paid amount
            </Text>
            <Text color='textSix' fontWeight='500'>
              ₦{numeral(payroll?.paid_amount).format('0,0.00')}
            </Text>
          </Flex>

          <Flex
            align='center'
            justify='space-between'
            w='full'
            bg='#f1f1f1'
            borderRadius='12px'
            px='5'
            py='4'
          >
            <Text
              color='textFour'
              fontWeight='500'
              fontSize={['0.875rem', '1rem']}
            >
              Unpaid amount
            </Text>
            <Text color='textSix' fontWeight='500'>
              ₦{numeral(payroll?.unpaid_amount).format('0,0.00')}
            </Text>
          </Flex>

          <Flex
            align='center'
            justify='space-between'
            w='full'
            bg='#f1f1f1'
            borderRadius='12px'
            px='5'
            py='4'
          >
            <Text
              color='textFour'
              fontWeight='500'
              fontSize={['0.875rem', '1rem']}
            >
              Date created
            </Text>
            <Text color='textSix' fontWeight='500'>
              {dayjs(payroll?.createdAt).format('MMM D, YYYY')}
            </Text>
          </Flex>

          {payroll?.approvedDate ? (
            <Flex
              align='center'
              justify='space-between'
              w='full'
              bg='#f1f1f1'
              borderRadius='12px'
              px='5'
              py='4'
            >
              <Text
                color='textFour'
                fontWeight='500'
                fontSize={['0.875rem', '1rem']}
              >
                Date approved
              </Text>
              <Text color='textSix' fontWeight='500'>
                {dayjs(payroll?.approvedDate).format('MMM D, YYYY')}
              </Text>
            </Flex>
          ) : null}
        </VStack>

        {payroll?.approvedDate ? (
          <CustomBtn
            mt={[6, 8]}
            onClick={() => router.push(`/payroll/${payroll?.salary_id}`)}
          >
            View staff details
          </CustomBtn>
        ) : checkUserType(user) === 'business' ||
          checkUserRole(user) === 'approver' ||
          checkUserRole(user) === 'finance' ? (
          <Grid templateColumns={['1fr', '1fr 1fr']} gap={[4, 6]} mt={[6, 8]}>
            <CustomBtn onClick={approveAction} isDisabled={rejectLoading}>
              Approve
            </CustomBtn>

            <CustomBtn
              color='redOne'
              bg='rgba(239, 128, 147, 0.4)'
              // onClick={() => rejectAction(pension?.pension_ref as string)}
              isLoading={rejectLoading}
              iserror={rejectError}
            >
              Reject
            </CustomBtn>
          </Grid>
        ) : null}

        <Box mt={[4, 6]} w='full'>
          <CustomBtn light onClick={onClose} isFullWidth>
            Close
          </CustomBtn>
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default PayrollItemModal;
