import { Box, Flex, useDisclosure } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import CustomTable from '@/components/CustomTable';
import CustomBtn from '@/components/CustomBtn';
import { Column } from 'react-table';
import {
  useGetAllPensionQuery,
  useDeclinePensionMutation,
} from '@/redux/api/pensionSlice';
import AppLoader from '@/components/AppLoader';
import CreateRemittance from './components/CreatePension';
import { IPensionItem } from '@/types/pensions';
import PensionTableItem from '@/components/PensionTableItem';
import PensionItemModal from './components/PensionItemModal';
import isBetween from 'dayjs/plugin/isBetween';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import payWithMonnify from 'src/helpers/payWithMonnify';
import { useAppSelector } from '@/hooks/reduxHooks';
import RemittanceModal from './components/RemittanceModal';
dayjs.extend(isBetween);

export const pensionsColumns: Column<IPensionItem>[] = [
  {
    Header: 'Ref',
    accessor: 'pension_ref',
  },

  {
    Header: 'Description',
    accessor: 'description',
  },

  {
    Header: 'Amount',
    accessor: 'amount',
  },

  {
    Header: 'Date Created',
    accessor: 'createdAt',
  },

  {
    Header: 'Approval Date',
    accessor: 'approvedDate',
  },
  {
    Header: 'Status',
    accessor: 'status',
    Cell: ({ value }) => <PensionTableItem value={value} />,
  },
];

const Pension: NextPage = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const columns = useMemo(() => pensionsColumns, []);
  const [selectedPension, setSelectedPension] = useState<
    IPensionItem | undefined
  >();
  const [pensions, setPensions] = useState<IPensionItem[]>([]);
  const [dateRange, setDateRange] = useState<string>('');
  const [dateFiltered, setDateFiltered] = useState<boolean>(false);
  const { data: pensionsData, isLoading } = useGetAllPensionQuery();
  const [
    declinePension,
    { isLoading: isLoadingDecline, isError: isErrorDecline },
  ] = useDeclinePensionMutation();

  const {
    isOpen: isUploadOpen,
    onOpen: onUploadOpen,
    onClose: onUploadClose,
  } = useDisclosure();

  const {
    isOpen: isPensionOpen,
    onOpen: onPensionOpen,
    onClose: onPensionClose,
  } = useDisclosure();

  const {
    isOpen: isOpenRemit,
    onOpen: onOpenRemit,
    onClose: onCloseRemit,
  } = useDisclosure();

  const handleSetDateRange = (val: string) => {
    setDateRange(val);
  };

  const selectPension = (pension: any) => {
    setSelectedPension({
      _id: pension?._id,
      initiator: pension?.initiator,
      transaction_fee: pension?.transaction_fee,
      status: pension?.status,
      pension_ref: pension?.pension_ref,
      amount: pension?.amount,
      total_amount: pension?.total_amount,
      createdAt: pension?.createdAt,
      updatedAt: pension?.updatedAt,
      description: pension?.description,
      payment_method: pension?.payment_method,
      approvedDate: pension?.approvedDate,
      approver: pension?.approver,
      employer: pension?.employer,
    });

    onPensionOpen();
  };

  const approveAction = () => {
    onPensionClose();
    onOpenRemit();
  };

  const rejectAction = async (val: string) => {
    try {
      const res = await declinePension({
        pension_ref: val,
      }).unwrap();

      toast.success(res?.message);

      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const showSuccess = () => {
    toast.success('Transaction successful!');
  };

  const showError = () => {
    toast.error('Transaction could not be completed');
  };

  const handleBankPayment = async () => {
    try {
      payWithMonnify({
        customerEmail: user?.email as string,
        customerName: user?.name || (user?.entity_name as string),
        amount: Number(selectedPension?.total_amount),
        walletId: user?.wallet?.wallet_id as string,
        // successFunc: fundWallet,
        showSuccess,
        showError,
      });
    } catch (error) {
      console.log(error);
      toast.error('Transaction could not be completed');
    }
  };

  const reversedPensions = useMemo(() => {
    if (!pensionsData) return [];
    const arr = pensionsData?.data.pensions.slice();

    return arr.reverse();
  }, []);

  useEffect(() => {
    if (dateRange && dateRange !== 'all') {
      const dateArr = dateRange.split(' ');
      const timeVal = dayjs().subtract(Number(dateArr[0]), dateArr[1]);
      const res = pensionsData?.data.pensions.filter((item: IPensionItem) =>
        dayjs(item.createdAt).isBetween(timeVal, dayjs())
      );

      setDateFiltered((prevState) => !prevState);
      setPensions((prevState) => [...prevState, ...res?.reverse() || []]);
      return;
    } else {
      setDateFiltered((prevState) => prevState);
    }
  }, [dateRange]);

  return (
    <Layout>
      <CreateRemittance
        isOpen={isOpen}
        onClose={onClose}
        onUploadOpen={onUploadOpen}
        isUploadOpen={isUploadOpen}
        onUploadClose={onUploadClose}
      />

      <RemittanceModal
        isOpen={isOpenRemit}
        onClose={onCloseRemit}
        pension={selectedPension}
        bankAction={handleBankPayment}
      />

      <PensionItemModal
        isOpen={isPensionOpen}
        onClose={onPensionClose}
        approveAction={approveAction}
        rejectAction={rejectAction}
        pension={selectedPension}
        rejectLoading={isLoadingDecline}
        rejectError={isErrorDecline}
      />

      <Flex justify='flex-end'>
        <CustomBtn onClick={onOpen}>New Remittance</CustomBtn>
      </Flex>

      <Box mt={10}>
        {isLoading ? (
          <AppLoader />
        ) : (
          <CustomTable
            data={
              !pensionsData ? [] : dateFiltered ? pensions : reversedPensions
            }
            columns={columns}
            title='Pensions'
            search
            rowClickAction={selectPension}
            handleSetDateRange={handleSetDateRange}
            dateRange={dateRange}
          />
        )}
      </Box>
    </Layout>
  );
};

export default Pension;
