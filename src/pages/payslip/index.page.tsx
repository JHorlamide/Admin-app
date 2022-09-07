import { Box, Flex, useDisclosure } from '@chakra-ui/react';
import { NextPage } from 'next';
import { Column } from 'react-table';
import React, { useEffect, useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import CustomBtn from '@/components/CustomBtn';
import CustomTable from '@/components/CustomTable';
import users from 'src/data/users';
import { IPayslip } from '@/types/payslips';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useAppSelector } from '@/hooks/reduxHooks';
import { useGetAllPayslipsQuery } from '@/redux/api/payslipsApiSlice';
import CreatePaySlipsModal from './components/CreatePayslips/index';
import { useRouter } from 'next/router';
import AppLoader from '@/components/AppLoader';
dayjs.extend(isBetween);

export const payslipsColumns: Column<IPayslip>[] = [
  { Header: 'ID', accessor: 'payslip_id' },
  { Header: 'Month', accessor: 'month' },
  {
    Header: 'Company name',
    accessor: 'company_id',
    Cell: ({ value }) => <>{value.entity_name}</>,
  },
  {
    Header: 'Date created',
    accessor: 'createdAt',
    Cell: ({ value }) => (
      <>{value ? dayjs(value).format('MMM D, YYYY') : '---'}</>
    ),
  },
];

const Payslip: NextPage = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [dateRange, setDateRange] = useState<string>('');
  const [dateFiltered, setDateFiltered] = useState<boolean>(false);
  const [payslips, setPayslips] = useState<IPayslip[]>([]);
  const columns = useMemo(() => payslipsColumns, []);

  const {
    data: payslipsData,
    isLoading: isLoadingPayslips,
    isError: isErrorPayslips,
  } = useGetAllPayslipsQuery();

  const {
    isOpen: isCreatePaySlips,
    onOpen: onCreatePaySlipsOpen,
    onClose: onCreatePaySlipsClose,
  } = useDisclosure();

  const handleSetDateRange = (val: string) => {
    setDateRange(val);
  };

  const selectPayslip = (payslip: any) => {
    router.push(`/payslip/${payslip?.payslip_id}`);
  };

  const reversedPayslips = useMemo(() => {
    if (!payslipsData) return [];
    const arr = payslipsData?.data.payslips.slice();

    return arr.reverse();
  }, [payslipsData]);

  useEffect(() => {
    if (dateRange && dateRange !== 'all') {
      const dateArr = dateRange.split(' ');
      const timeVal = dayjs().subtract(Number(dateArr[0]), dateArr[1]);
      console.log('timeVal Payslip: ', timeVal);
      const res = payslipsData?.data.payslips.filter((item) =>
        dayjs(item.createdAt).isBetween(timeVal, dayjs())
      );

      setDateFiltered((prevState) => !prevState);
      setPayslips((prevState) => [...prevState, ...(res?.reverse() || [])]);
      return;
    } else {
      setDateFiltered((prevState) => prevState);
    }
  }, [dateRange]);

  return (
    <Layout>
      <CreatePaySlipsModal
        isOpen={isCreatePaySlips}
        onClose={onCreatePaySlipsClose}
      />

      <Flex justify='flex-end'>
        <CustomBtn onClick={onCreatePaySlipsOpen}>New Payslips</CustomBtn>
      </Flex>

      <Box mt={10}>
        {isLoadingPayslips ? (
          <AppLoader />
        ) : (
          <CustomTable
            data={
              !payslipsData ? [] : dateFiltered ? payslips : reversedPayslips
            }
            columns={columns}
            title='Payslips'
            search
            rowClickAction={selectPayslip}
            handleSetDateRange={handleSetDateRange}
            dateRange={dateRange}
          />
        )}
      </Box>
    </Layout>
  );
};

export default Payslip;
