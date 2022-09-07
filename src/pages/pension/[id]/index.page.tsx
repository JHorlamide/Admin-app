import React, { useMemo } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import CustomTable from '@/components/CustomTable';
import CustomBtn from '@/components/CustomBtn';
import AppLoader from '@/components/AppLoader';
import Layout from '@/components/Layout';
import { Column } from 'react-table';
import { ICompany } from '@/types/company';
import { useGetPensionByCompIdQuery } from '@/redux/api/companySlice';
import { Box } from '@chakra-ui/react';

export const pensionsColumns: Column<ICompany>[] = [
  {
    Header: 'Company Name',
    accessor: 'name',
  },

  {
    Header: 'Email',
    accessor: 'email',
  },

  {
    Header: 'Phone',
    accessor: 'phone',
  },

  {
    Header: 'Address',
    accessor: 'address',
  },
];

const CompanyPensions: NextPage = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const columns = useMemo(() => pensionsColumns, []);
  const { data, isLoading } = useGetPensionByCompIdQuery({ company_id: id });

  console.log(data?.data);

  return (
    <Layout>
      <Box mt={10}>
        {isLoading ? (
          <AppLoader />
        ) : (
          <CustomTable
            data={data?.data.pension ?? []}
            columns={columns}
            title='Company Pensions'
            search
          />
        )}
      </Box>
    </Layout>
  );
};

export default CompanyPensions;
