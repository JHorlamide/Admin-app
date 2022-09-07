import { Box, Flex, Badge } from '@chakra-ui/react';
import React, { useCallback, useMemo } from 'react';
import { NextPage } from 'next';
import Layout from '@/components/Layout';
import capitalize from 'src/helpers/capitalize';
import { Column } from 'react-table';
import CustomBtn from '@/components/CustomBtn';
import CustomTable from '@/components/CustomTable';
import { useRouter } from 'next/router';
import StatsCard from '../../components/StatsCard';
import { GiTakeMyMoney } from 'react-icons/gi';
import { useAppSelector } from '@/hooks/reduxHooks';
import dayjs from 'dayjs';
import { useGetUserTransactionsQuery } from '@/redux/api/userApiSlice';
import numeral from 'numeral';
import AppLoader from '@/components/AppLoader';
import TransactionTableItem from 'src/components/TransactionTableItem/index';

export const transactionsHistoryColumns: Column<any>[] = [
  {
    Header: 'Ref',
    accessor: 'trans_ref',
  },

  {
    Header: 'Description',
    accessor: 'description',
  },

  {
    Header: 'Amount',
    accessor: 'amount_paid',
  },

  {
    Header: 'Payment Method',
    accessor: 'payment_method',
  },

  {
    Header: 'Date',
    accessor: (row) => dayjs(row?.paid_date).format('MMM D, YYYY h:mm A'),
  },

  {
    Header: 'Status',
    accessor: 'status',
    Cell: ({ row: { original } }) => (<TransactionTableItem value={original.status} />),
  },
];

const Wallet: NextPage = () => {
  const router = useRouter();
  const columns = useMemo(() => transactionsHistoryColumns, []);
  const user = useAppSelector((state) => state.auth.user);

  const { data, isLoading } = useGetUserTransactionsQuery({
    wallet_id: user?.wallet?.wallet_id,
  });

  const fundWallet = () => {
    router.push('/wallet/fund');
  };

  const transfer = () => {
    router.push('/wallet/transfer');
  };

  const selectTransaction = useCallback(() => {
    //
  }, []);
  return (
    <Layout>
      <Flex justify={'space-between'}>
        <Box w='400px'>
          <StatsCard
            title={'Available Balance'}
            stat={numeral(Number(user?.wallet?.available_balance)).format("0,0.00")}
            icon={<GiTakeMyMoney size={'3em'} />}
            text={user?.wallet?.currency}
          />
        </Box>

        <Flex justify={'space-between'}>
          <CustomBtn onClick={transfer} mx={5}>
            Transfer
          </CustomBtn>

          <CustomBtn onClick={fundWallet}>Full Wallet</CustomBtn>
        </Flex>
      </Flex>

      <Box mt={10}>
        {isLoading ? (
          <AppLoader />
        ) : (
          <CustomTable
            data={data?.data ?? []}
            columns={columns}
            title={`Transactions History`}
            search
            rowClickAction={selectTransaction}
          />
        )}
      </Box>
    </Layout>
  );
};

export default Wallet;
