import React, { useMemo } from 'react';
import { TabPanel, TabPanels, Tabs, Badge } from '@chakra-ui/react';
import { NextPage } from 'next';
import { Column } from 'react-table';
import { useRouter } from 'next/router';
import { IUserTransaction } from '../../../../types/wallet';
import Layout from '@/components/Layout';
import CustomTable from '@/components/CustomTable';
import AppLoader from '@/components/AppLoader';
import capitalize from 'src/helpers/capitalize';
import { useGetUserTransactionsQuery } from '@/redux/api/userApiSlice';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import CustomBtn from '@/components/CustomBtn';
import TransactionTableItem from "src/components/TransactionTableItem/index";
dayjs.extend(isBetween);

const transactionStatus = (status: string) => {
  switch (status) {
    case 'paid':
      return 'green';
      break;
    case 'pending':
      return 'blue';
      break;
    case 'canceled':
      return 'yellow';
      break;
    case 'failed':
      return 'red';
      break;
    default:
      break;
  }
};

export const transactionsColumns: Column<any>[] = [
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

const Transactions: NextPage = () => {
  const router = useRouter();
  const id = String(router.query.wallet_id);
  const columns = useMemo(() => transactionsColumns, []);

  const { data, isLoading } = useGetUserTransactionsQuery({
    wallet_id: id,
  });

  return (
    <Layout>
      <Tabs variant='unstyled' isLazy>
        <TabPanels mt='4'>
          <TabPanel>
            {isLoading ? (
              <AppLoader />
            ) : (
              <CustomTable
                data={data?.data ?? []}
                columns={columns}
                title={`Transactions History`}
                search
              />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Layout>
  );
};

export default Transactions;
