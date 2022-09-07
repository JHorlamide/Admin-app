import {
  Flex,
  HStack,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import Layout from '@/components/Layout';
import { Column } from 'react-table';
import { FormEvent, useCallback, useMemo, useState } from 'react';
import CustomTable from '@/components/CustomTable';
import { useRouter } from 'next/router';
import AppLoader from '@/components/AppLoader';
import CustomBtn from '@/components/CustomBtn';
import { ICompany } from '@/types/company';
import CreateCompanyModal from './register';
import { useGetAllCompanyQuery } from '@/redux/api/companySlice';
import EditCompanyModal from './update';

const Company: NextPage = () => {
  const companyColumns: Column<any>[] = [
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

    {
      Header: 'Action',
      Cell: ({ row: { original } }) => (
        <>
          <HStack spacing={3}>
            <CustomBtn
              bg='greenTwo'
              onClick={() =>
                editCompanyModal({
                  _id: original._id,
                  name: original.name,
                  email: original.email,
                  phone: original.phone,
                  address: original.address,
                })
              }
            >
              Edit
            </CustomBtn>
          </HStack>
        </>
      ),
    },
  ];

  const router = useRouter();
  const columns = useMemo(() => companyColumns, []);
  const { data, isLoading } = useGetAllCompanyQuery();
  const [companyData, setCompanyData] = useState<ICompany>({
    name: '',
    email: '',
    phone: '',
    address: '',
    _id: '',
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();

  const selectComp = useCallback((val: ICompany) => {
    router.push(`/companies/${val._id}`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editCompanyModal = (companyData: any) => {
    onOpenEdit();
    setCompanyData(companyData);
  };

  return (
    <Layout>
      <CreateCompanyModal isOpen={isOpen} onClose={onClose} />

      <EditCompanyModal
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
        companyData={companyData}
      />

      <Flex justify='flex-end'>
        <CustomBtn onClick={onOpen}>Create New Company</CustomBtn>
      </Flex>

      <Tabs variant='unstyled' isLazy>
        <TabPanels mt='4'>
          <TabPanel>
            {isLoading ? (
              <AppLoader />
            ) : (
              <CustomTable
                data={data?.data ?? []}
                columns={columns}
                title='Company'
                search
                // rowClickAction={selectComp}
              />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Layout>
  );
};

export default Company;
