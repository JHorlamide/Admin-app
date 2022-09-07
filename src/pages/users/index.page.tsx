import {
  Box,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  VStack,
  Heading,
  Select,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import Layout from '@/components/Layout';
import { Column } from 'react-table';
import { IUser, User } from '@/types/user';
import { original } from '@reduxjs/toolkit';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import CustomTable from '@/components/CustomTable';
import checkUserType from 'src/helpers/checkUserType';
import checkUserRole from 'src/helpers/checkUserRole';
import capitalize from 'src/helpers/capitalize';
import numeral from 'numeral';
import { useRouter } from 'next/router';
import {
  useGetCorporateUserQuery,
  useGetIndividualUserQuery,
  useEditUserRoleMutation,
  useRemoveUserRoleMutation,
} from '@/redux/api/userApiSlice';
import AppLoader from '@/components/AppLoader';
import CustomBtn from '@/components/CustomBtn';
import CustomInput from '@/components/CustomInput';
import toast from 'react-hot-toast';

export const usersColumns: Column<any>[] = [
  {
    Header: 'Individual Name',
    accessor: (row) => row.entity_name ?? `${row.first_name} ${row.last_name}`,
  },

  {
    Header: 'Company',
    accessor: (row) => row.company ?? row.entity_name ?? 'N/A',
  },

  {
    Header: 'Email',
    accessor: 'email',
  },

  {
    Header: 'Phone number',
    accessor: 'phone',
  },

  {
    Header: 'Account type',
    accessor: (row) => capitalize(row.account_type) || 'Business',
  },

  {
    Header: 'Role',
    accessor: (row) => (row.roles ? row.roles[0] || 'N/A' : 'Owner'),
  },
];

const userRoleOptions = [
  { label: 'Initiator', value: 'initiator' },
  { label: 'Approver', value: 'approver' },
  { label: 'Finance', value: 'finance' },
];

const Users: NextPage = () => {
  const managerUserColumns: Column<any>[] = [
    {
      Header: 'Name',
      accessor: (row) =>
        row.entity_name ?? `${row.first_name} ${row.last_name}`,
    },

    {
      Header: 'Email',
      accessor: (row) => row.company ?? row.entity_name ?? 'N/A',
    },

    {
      Header: 'Role',
      accessor: (row) =>
        row.roles ?? row.roles.length > 0 ?? row.roles[0] ?? 'N/A',
    },

    {
      Header: 'Action',
      accessor: 'a',
      Cell: ({ row: { original } }) => (
        <>
          <HStack spacing={3}>
            <CustomBtn
              bg='greenTwo'
              onClick={() => openModalEdit(original._id)}
            >
              Edit
            </CustomBtn>

            <CustomBtn
              type='submit'
              bg='redTwo'
              onClick={() => openModalRemove(original._id, original.roles)}
            >
              Delete
            </CustomBtn>
          </HStack>
        </>
      ),
    },
  ];

  const router = useRouter();
  const [userId, setUserId] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const columns = useMemo(() => usersColumns, []);
  const manageColumns = useMemo(() => managerUserColumns, []);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userRoles, setUserRoles] = useState<string[]>(['']);

  const {
    isOpen: isOpenRemove,
    onOpen: onOpenRemove,
    onClose: onCloseRemove,
  } = useDisclosure();

  const [editUserRole, { isLoading: isLoadingUserEdit, isError }] =
    useEditUserRoleMutation();

  const [
    removeUserRole,
    { isLoading: isLoadingUserRemove, isError: isRemoveUserRoleError },
  ] = useRemoveUserRoleMutation();

  const { data: individualUsr, isLoading: isLoadingIndividual } =
    useGetIndividualUserQuery();

  const { data: corporateUsr, isLoading: isLoadingCorporate } =
    useGetCorporateUserQuery();

  const selectUser = useCallback((val: User) => {
    router.push(`/users/${val._id}`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openModalEdit = (user_id: string) => {
    onOpen();
    setUserId(user_id);
  };

  const openModalRemove = (user_id: string, user_roles: string[]) => {
    onOpenRemove();
    setUserId(user_id);
    setUserRoles(user_roles);
  };

  const handleEditUserRole = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await editUserRole({
        user_id: userId,
        givenRoles: [role],
      }).unwrap();

      toast.success(response.message);

      onClose();

      setUserId('');
      setRole('');
    } catch (error) {
      console.log('Error performing request: ', error);
    }
  };

  const handleRemoveUserRole = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await removeUserRole({
        user_id: userId,
        roles: [role],
      }).unwrap();

      toast.success(response.message);

      onClose();

      setUserId('');
      setRole('');
    } catch (error) {
      console.log('Error performing request: ', error);
    }
  };

  return (
    <Layout>
      {/* Edit User Role */}
      <Box>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          isCentered
          motionPreset='slideInBottom'
        >
          <ModalOverlay />
          <ModalContent
            mx={[4, 0]}
            maxW='490'
            w='full'
            bg='white'
            borderRadius='6px'
            className='appBox'
            px={[4, 6, 8]}
            py={[6, 6, 8]}
          >
            <Heading
              as='h3'
              color='textOne'
              fontWeight='600'
              fontSize={['1.2rem', '1.5rem']}
              textAlign='center'
            >
              Select Role to Remove
            </Heading>

            <form onSubmit={handleEditUserRole}>
              <VStack mt={[8, 10]} spacing={[4, 6]}>
                <Box w='full'>
                  <CustomInput
                    id='role'
                    label='Choose user role'
                    aria-label='Choose role for user'
                    select
                    selectOptions={userRoleOptions}
                    selectProps={{
                      value: role,
                      onChange: (e) => setRole(e.target.value),
                    }}
                    selectPlaceholder='Choose a role'
                  />
                </Box>
              </VStack>

              <CustomBtn
                isFullWidth
                mt={[8, 10]}
                disabled={role.length <= 0}
                isLoading={isLoadingUserEdit}
                iserror={isError}
                type='submit'
              >
                Updated Role
              </CustomBtn>
            </form>
          </ModalContent>
        </Modal>
      </Box>

      {/* Remove User Role */}
      <Box>
        <Modal
          isOpen={isOpenRemove}
          onClose={onCloseRemove}
          isCentered
          motionPreset='slideInBottom'
        >
          <ModalOverlay />
          <ModalContent
            mx={[4, 0]}
            maxW='490'
            w='full'
            bg='white'
            borderRadius='6px'
            className='appBox'
            px={[4, 6, 8]}
            py={[6, 6, 8]}
          >
            <Heading
              as='h3'
              color='textOne'
              fontWeight='600'
              fontSize={['1.2rem', '1.5rem']}
              textAlign='center'
            >
              Remove Role
            </Heading>

            <form onSubmit={handleRemoveUserRole}>
              <VStack mt={[8, 10]} spacing={[4, 6]}>
                <Box w='full'>
                  <Select
                    border={'1px solid #DBE2EA'}
                    borderRadius='8px'
                    color='textOne'
                    w='full'
                    fontSize='0.875rem'
                    size='lg'
                    fontFamily='poppins'
                    bg={'transparent'}
                    placeholder='Choose User role'
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    {userRoles.map((userRole, index) => {
                      return <option key={index}>{userRole}</option>;
                    })}
                  </Select>
                </Box>
              </VStack>

              <CustomBtn
                isFullWidth
                mt={[8, 10]}
                disabled={role.length <= 0}
                isLoading={isLoadingUserRemove}
                iserror={isRemoveUserRoleError}
                type='submit'
              >
                Updated Role
              </CustomBtn>
            </form>
          </ModalContent>
        </Modal>
      </Box>
      
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
            Individual
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
            Business
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
            Manage User
          </Tab>
        </TabList>

        <TabPanels mt='4'>
          <TabPanel>
            {isLoadingIndividual ? (
              <AppLoader />
            ) : (
              <CustomTable
                data={individualUsr?.data ?? []}
                columns={columns}
                title='Individual Users'
                search
                rowClickAction={selectUser}
              />
            )}
          </TabPanel>

          <TabPanel>
            {isLoadingCorporate ? (
              <AppLoader />
            ) : (
              <CustomTable
                data={corporateUsr?.data ?? []}
                columns={columns}
                title='Corporate Users'
                search
                rowClickAction={selectUser}
              />
            )}
          </TabPanel>

          <TabPanel>
            {isLoadingCorporate ? (
              <AppLoader />
            ) : (
              <CustomTable
                data={corporateUsr?.data ?? []}
                columns={manageColumns}
                title='Users'
                search
                // rowClickAction={selectUser}
              />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Layout>
  );
};

export default Users;
