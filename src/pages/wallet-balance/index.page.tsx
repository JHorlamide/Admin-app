import React from "react";
import Layout from "@/components/Layout";
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
} from "@chakra-ui/react";
import { useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import CustomBtn from "@/components/CustomBtn";
import { FormEvent, useEffect, useState } from "react";
import CustomInput from "@/components/CustomInput";
import CustomTable from "@/components/CustomTable";
import { Column } from "react-table";
import capitalize from "src/helpers/capitalize";
import AppLoader from "@/components/AppLoader";
import toast from "react-hot-toast";
import user from "src/data/users";
import { IUser } from "@/types/user";
import { CSVDownload, CSVLink } from "react-csv";

export const walletBalanceColumns: Column<any>[] = [
  {
    Header: "Individual Name",
    accessor: (row) => row.entity_name ?? `${row.first_name} ${row.last_name}`,
  },

  {
    Header: "Company",
    accessor: (row) => row.company ?? row.entity_name ?? "N/A",
  },

  {
    Header: "Email",
    accessor: "email",
  },

  {
    Header: "Phone number",
    accessor: "phone",
  },

  {
    Header: "Account type",
    accessor: (row) => capitalize(row.account_type) || "Business",
  },

  {
    Header: "Role",
    accessor: (row) => (row.roles ? row.roles[0] || "N/A" : "Owner"),
  },
];

const AmtOfTransactions = () => {
  const isLoadingTrans = false;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const columns = useMemo(() => walletBalanceColumns, []);

  const selectTrans = () => {};

  return (
    <Layout>
      <Flex justify='flex-end'>
        <CustomBtn onClick={onOpen}>
          <CSVLink data={user} target='_blank'>
            Export to CSV
          </CSVLink>
        </CustomBtn>
      </Flex>

      <Box mt={10}>
        {isLoadingTrans ? (
          <AppLoader />
        ) : (
          <CustomTable
            data={user ?? []}
            search
            columns={columns}
            title='Wallet Balance'
            rowClickAction={selectTrans}
          />
        )}
      </Box>
    </Layout>
  );
};

export default AmtOfTransactions;
