import { Box, Flex, useDisclosure } from '@chakra-ui/react';
import { NextPage } from 'next';
import { Column } from 'react-table';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import CustomBtn from '@/components/CustomBtn';
import CustomTable from '@/components/CustomTable';
import { IPayrollItem } from '@/types/payroll';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import PensionTableItem from '@/components/PensionTableItem';
import { useGetPayrollsQuery } from '@/redux/api/payrollApiSlice';
import CreatePayroll from './components/CreatePayroll/index';
import payWithMonnify from 'src/helpers/payWithMonnify';
import PayrollItemModal from './components/PayrolItemModal/index';
import { useDeclinePensionMutation } from '@/redux/api/pensionSlice';
import toast from 'react-hot-toast';
import RemittanceModal from './components/RemittanceModal';
import { useAppSelector } from '@/hooks/reduxHooks';
import Script from 'next/script';
import AppLoader from '@/components/AppLoader';
dayjs.extend(isBetween);

export const pensionsColumns: Column<IPayrollItem>[] = [
  { Header: 'ID', accessor: 'salary_id' },
  { Header: 'Month', accessor: 'month' },
  {
    Header: 'Amount',
    accessor: 'total_amount',
    Cell: ({ value }) => <>₦{value}</>,
  },
  {
    Header: 'Date created',
    accessor: 'createdAt',
    Cell: ({ value }) => (
      <>{value ? dayjs(value).format('MMM D, YYYY') : '---'}</>
    ),
  },
  {
    Header: 'Approval date',
    accessor: 'approvedDate',
    Cell: ({ value }) => (
      <>{value ? dayjs(value).format('MMM D, YYYY') : '---'}</>
    ),
  },
  {
    Header: 'Status',
    accessor: 'status',
    Cell: ({ value }) => <PensionTableItem value={value} />,
  },
];

const Payroll: NextPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [dateFiltered, setDateFiltered] = useState<boolean>(false);
  const [selectedPayroll, setSelectedPayroll] = useState<
    IPayrollItem | undefined
  >();
  const [payrolls, setPayrolls] = useState<IPayrollItem[]>([]);
  const [dateRange, setDateRange] = useState<string>('');
  const columns = useMemo(() => pensionsColumns, []);

  const { data: payrollsData, isLoading: isLoadingPayrolls } =
    useGetPayrollsQuery();

  const [
    declinePension,
    { isLoading: isLoadingDecline, isError: isErrorDecline },
  ] = useDeclinePensionMutation();

  const {
    isOpen: isPayrollOpen,
    onOpen: onPayrollOpen,
    onClose: onPayrollClose,
  } = useDisclosure();

  const {
    isOpen: isCreatePayrollOpen,
    onOpen: onCreatePayrollOpen,
    onClose: onCreatePayrollClose,
  } = useDisclosure();

  const {
    isOpen: isOpenRemit,
    onOpen: onOpenRemit,
    onClose: onCloseRemit,
  } = useDisclosure();

  const selectPayroll = (payroll: any) => {
    setSelectedPayroll(payroll);
    onPayrollOpen();
  };

  const handleSetDateRange = (val: string) => {
    setDateRange(val);
  };

  const showMonnifyError = (e: any) => {
    console.log(e);
    toast.error('Payment service integration failed');
  };

  const showSuccess = () => {
    toast.success('Transaction successful!');
  };

  const showError = () => {
    toast.error('Transaction could not be completed');
  };

  const approveAction = () => {
    onPayrollClose();
    onOpenRemit();
  };

  const rejectAction = async (val: string) => {
    try {
      const res = await declinePension({
        pension_ref: val,
      }).unwrap();

      toast.success(res?.message);

      onPayrollClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleBankPayment = async () => {
    try {
      payWithMonnify({
        customerEmail: user?.email as string,
        customerName: user?.name || (user?.entity_name as string),
        amount: Number(selectedPayroll?.total_amount),
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

  const reversedPayrolls = useMemo(() => {
    if (!payrollsData) return [];
    const arr = payrollsData?.data.salary.slice();
    return arr.reverse();
  }, [payrollsData]);

  useEffect(() => {
    if (dateRange && dateRange !== 'all') {
      const dateArr = dateRange.split(' ');
      const timeVal = dayjs().subtract(Number(dateArr[0]), dateArr[1]);
      console.log('timeVal Payslip: ', timeVal);
      const res = payrollsData?.data.salary.filter((item: any) =>
        dayjs(item.createdAt).isBetween(timeVal, dayjs())
      );

      setDateFiltered((prevState) => !prevState);
      setPayrolls((prevState) => [...prevState, ...(res?.reverse() || [])]);
    } else {
      setDateFiltered((prevState) => prevState);
    }
  }, [dateRange]);

  return (
    <Layout>
      <Script
        strategy='afterInteractive'
        src='https://sdk.monnify.com/plugin/monnify.js'
        onError={(e) => showMonnifyError(e)}
      />

      <CreatePayroll
        isOpen={isCreatePayrollOpen}
        onClose={onCreatePayrollClose}
        payroll={selectedPayroll}
      />

      <RemittanceModal
        isOpen={isOpenRemit}
        onClose={onCloseRemit}
        payroll={selectedPayroll}
        bankAction={handleBankPayment}
      />

      <PayrollItemModal
        isOpen={isPayrollOpen}
        onClose={onPayrollClose}
        payroll={selectedPayroll}
        approveAction={approveAction}
        rejectAction={rejectAction}
        rejectLoading={isLoadingDecline}
        rejectError={isErrorDecline}
      />

      <Flex justify='flex-end'>
        <CustomBtn onClick={onCreatePayrollOpen}>New Payroll</CustomBtn>
      </Flex>

      <Box mt={10}>
        {isLoadingPayrolls ? (
          <AppLoader />
        ) : (
          <CustomTable
            data={
              !payrollsData ? [] : dateFiltered ? payrolls : reversedPayrolls
            }
            columns={columns}
            title='Payroll'
            search
            rowClickAction={selectPayroll}
            handleSetDateRange={handleSetDateRange}
            dateRange={dateRange}
          />
        )}
      </Box>
    </Layout>
  );
};

export default Payroll;
