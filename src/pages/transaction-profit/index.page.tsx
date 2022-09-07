import React from 'react';
import Layout from '@/components/Layout';
import {
  Box,
  Flex,
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

export const usersColumns: Column<any>[] = [
  {
    Header: 'Transfer',
    accessor: (row) => row.entity_name ?? `${row.first_name} ${row.last_name}`,
  },

  {
    Header: 'Bill Payment',
    accessor: (row) => row.company ?? row.entity_name ?? 'N/A',
  },

  {
    Header: 'Pensions',
    accessor: 'email',
  },

  {
    Header: 'Taxes',
    accessor: 'phone',
  },

  {
    Header: 'Loan',
    accessor: (row) => capitalize(row.account_type) || 'Business',
  },

  {
    Header: 'Role',
    accessor: (row) => (row.roles ? row.roles[0] || 'N/A' : 'Owner'),
  },
];

const AmtOfTransactions = () => {
  const isLoadingTrans = false;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const columns = useMemo(() => usersColumns, []);

  const selectTrans = () => {

  }

  return (
    <Layout>
      <Flex justify='flex-end'>
        <CustomBtn onClick={onOpen}>Analyze Transactions</CustomBtn>
      </Flex>

      <Box mt={10}>
        {isLoadingTrans ? (
          <AppLoader />
        ) : (
          <CustomTable
            data={user ?? []}
            columns={columns}
            title='Profit for Transactions'
            search
            rowClickAction={selectTrans}
          />
        )}
      </Box>
    </Layout>
  );
};

export default AmtOfTransactions;
