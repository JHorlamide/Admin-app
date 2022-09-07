import React from 'react';
import Layout from '@/components/Layout';
import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import CustomBtn from '@/components/CustomBtn';
import CustomTable from '@/components/CustomTable';
import { Column } from 'react-table';
import capitalize from 'src/helpers/capitalize';
import AppLoader from '@/components/AppLoader';
import toast from 'react-hot-toast';
import user from 'src/data/users';
import dayjs from 'dayjs';
import TransactionTableItem from 'src/components/TransactionTableItem/index';
import { useAppSelector } from '@/hooks/reduxHooks';
import { useGetUserTransactionsQuery } from '@/redux/api/userApiSlice';


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

const AmtOfTransactions = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const columns = useMemo(() => transactionsHistoryColumns, []);
  const selectTrans = () => {};
  
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading } = useGetUserTransactionsQuery({
    wallet_id: user?.wallet?.wallet_id,
  });

  return (
    <Layout>
      <Flex justify='flex-end'>
        <CustomBtn onClick={onOpen}>Analyze Transactions</CustomBtn>
      </Flex>

      <Tabs variant='unstyled' isLazy>
        <TabList gap={[0, 4, 6]}>
          <Tab
            color='greenTwo'
            fontSize={['1rem', null, '1.125rem']}
            _selected={{
              color: 'white',
              fontWeight: '700',
              bg: 'greenTwo',
              borderRadius: '50px',
            }}
          >
            Refunds
          </Tab>

          <Tab
            color='greenTwo'
            fontSize={['1rem', null, '1.125rem']}
            _selected={{
              color: 'white',
              fontWeight: '700',
              bg: 'greenTwo',
              borderRadius: '50px',
            }}
          >
            Cancelled Transactions
          </Tab>
        </TabList>

        <TabPanels mt='4'>
          <TabPanel>
            {isLoading ? (
              <AppLoader />
            ) : (
              <CustomTable
                data={data?.data ?? []}
                columns={columns}
                title='Refund Transactions'
                search
                rowClickAction={selectTrans}
              />
            )}
          </TabPanel>

          <TabPanel>
            {isLoading ? (
              <AppLoader />
            ) : (
              <CustomTable
                data={data?.data ?? []}
                columns={columns}
                title='Cancelled Transactions'
                search
                rowClickAction={selectTrans}
              />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Layout>
  );
};

export default AmtOfTransactions;
