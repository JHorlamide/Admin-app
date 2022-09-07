import { NextPage } from 'next';
import Layout from '@/components/Layout';
import {
  Box,
  Flex,
  Heading,
  Modal,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import CustomBtn from '@/components/CustomBtn';
import { FormEvent, useEffect, useState } from 'react';
import CustomInput from '@/components/CustomInput';
import {
  useGetAllBanksQuery,
  useValidateAcctNumberQuery,
  useGetPfasQuery,
  useCreatePfaMutation,
} from '@/redux/api/pfasApiSlice';
import { taxitPayApi } from '@/redux/apiSlice';
import CustomTable from '@/components/CustomTable';
import { Column } from 'react-table';
import { IPfa } from '@/types/pfas';
import capitalize from 'src/helpers/capitalize';
import AppLoader from '@/components/AppLoader';
import toast from 'react-hot-toast';

export const usersColumns: Column<IPfa>[] = [
  {
    Header: 'name',
    accessor: (row) => row.name ?? 'N/A',
  },

  {
    Header: 'PFA account name',
    accessor: (row) => row.pfa_account_name ?? 'N/A',
  },

  {
    Header: 'PFA account number.',
    accessor: (row) => row.pfa_account_number ?? 'N/A',
  },

  {
    Header: 'PFC name',
    accessor: (row) => capitalize(row.pfc_name) ?? 'N/A',
  },

  {
    Header: 'PFC sort code',
    accessor: (row) => row.pfc_name ?? 'N/A',
  },

  {
    Header: 'date created',
    accessor: (row) => row.createdAt ?? 'N/A',
  },
];

const Pfas: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [pfaName, setPfaName] = useState('');
  const [pfaAcctName, setPfaAcctName] = useState('');
  const [pfaAcctNum, setPfaAcctNum] = useState('');
  const [pfcCode, setPfcCode] = useState('');
  const [pfcName, setPfcName] = useState('');

  const router = useRouter();
  const columns = useMemo(() => usersColumns, []);
  const selectPFA = useCallback((val: IPfa) => {
    router.push(`/pfas/${val._id}`);
  }, []);

  const { data: banksData, isLoading: isLoadingBanks } = useGetAllBanksQuery();
  const { data: pfas, isLoading: isLoadingPfas } = useGetPfasQuery();
  const [createPfa, { isLoading, isError }] = useCreatePfaMutation();

  const {
    data: validateData,
    isLoading: isLoadingValidate,
    refetch: refetchValidate,
    isFetching: isFetchingValidate,
  } = useValidateAcctNumberQuery(
    {
      accountNumber: pfaAcctNum,
      bankCode: banksData?.data.banks.find(
        (bank) => bank.name.toLowerCase() === pfcName.toLowerCase()
      )?.code as string,
    },
    { skip: !pfaAcctNum || !pfcName || pfaAcctNum.length !== 10 }
  );

  const clearInputFields = () => {
    setPfaName('');
    setPfaAcctName('');
    setPfaAcctNum('');
    setPfcName('');
    setPfcCode('');
  };

  const onModalClose = () => {
    clearInputFields();

    taxitPayApi.util.invalidateTags(['BankData']);

    onClose();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await createPfa({
        name: pfaName,
        pfa_account_name: pfaAcctName,
        pfa_account_number: pfaAcctNum,
        pfc_name: pfcName,
        pfc_sort_code: pfcCode,
      }).unwrap();

      if (Number(response.code) === 201) {
        toast.success(response.message);
        onClose();

        clearInputFields();
        return;
      };

      toast.error(response.message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!validateData) return;

    setPfaAcctName(validateData?.data?.accountName);
  }, [validateData, isLoadingValidate]);

  useEffect(() => {
    if (!pfcName || !pfaAcctNum) return;

    if (pfaAcctNum.length !== 10) return;

    refetchValidate();
  }, [pfaAcctNum, pfcName]);

  return (
    <Layout>
      <Modal
        isOpen={isOpen}
        onClose={onModalClose}
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
            Create PFA
          </Heading>

          <form onSubmit={handleSubmit}>
            <VStack mt={[8, 10]} spacing={[4, 6]}>
              <CustomInput
                label='PFA name'
                id='pfaName'
                inputProps={{
                  placeholder: 'e.g AIICO Pension Managers Limited',
                  value: pfaName,
                  onChange: (e) => setPfaName(e.target.value),
                }}
                isRequired
              />

              <CustomInput
                label='PFC name'
                id='pfcName'
                selectProps={{
                  value: pfcName,
                  onChange: (e) => setPfcName(e.target.value),
                }}
                selectOptions={banksData ? banksData?.data?.banks : []}
                select
                selectLoading={isLoadingBanks}
                selectPlaceholder='e.g First Bank'
                isRequired
              />

              <CustomInput
                label='PFA account number'
                id='pfaAcctNum'
                inputProps={{
                  placeholder: 'e.g 0723371427',
                  value: pfaAcctNum,
                  onChange: (e) => setPfaAcctNum(e.target.value),
                  type: 'number',
                }}
                
                isRequired
              />

              <Box w='full'>
                <Text color='#171717' fontSize='.875rem' fontWeight='500'>
                  PFA account name:
                </Text>
                {pfaAcctNum.length !== 10 ? (
                  <></>
                ) : isLoadingValidate || isFetchingValidate ? (
                  <Spinner size='sm' />
                ) : validateData?.data ? (
                  <Text color='greenOne' fontWeight='500'>
                    {validateData?.data?.accountName}
                  </Text>
                ) : (
                  <Text fontSize='14px'>Account number not found</Text>
                )}
              </Box>

              <CustomInput
                label='PFC sort code'
                id='pfcCode'
                inputProps={{
                  placeholder: 'e.g 011',
                  value: pfcCode,
                  onChange: (e) => setPfcCode(e.target.value),
                  type: 'number',
                }}
                isRequired
              />

              <CustomBtn
                type='submit'
                isFullWidth
                iserror={isError}
                isLoading={isLoading}
              >
                Submit
              </CustomBtn>
            </VStack>
          </form>
        </ModalContent>
      </Modal>

      <Flex justify='flex-end'>
        <CustomBtn onClick={onOpen}>Create PFA</CustomBtn>
      </Flex>

      <Box mt={10}>
        {isLoadingPfas ? (
          <AppLoader />
        ) : (
          <CustomTable
            data={pfas?.data ? [] : []}
            columns={columns}
            title='PFAs (Pension Fund Administrators)'
            search
            rowClickAction={selectPFA}
          />
        )}
      </Box>
    </Layout>
  );
};

export default Pfas;
