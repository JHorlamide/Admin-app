import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import { useMemo } from "react";
import { useRouter } from "next/router";
import CustomBtn from "@/components/CustomBtn";
import CustomTable from "@/components/CustomTable";
import { Column } from "react-table";
import capitalize from "src/helpers/capitalize";
import AppLoader from "@/components/AppLoader";
import toast from "react-hot-toast";
import usersData from "src/data/users";
import { useAppSelector } from "@/hooks/reduxHooks";
import { useGetUserTransactionsQuery } from "@/redux/api/userApiSlice";
import dayjs from "dayjs";
import TransactionTableItem from "@/components/TransactionTableItem";
import PaymentItemModal from "./components/PaymentItemModal";
import { IPaymentLinkResItem } from "@/types/paymentLinks";
import { CSVDownload, CSVLink } from "react-csv";

export const transactionsHistoryColumns: Column<any>[] = [
  {
    Header: "Ref",
    accessor: "trans_ref",
  },

  {
    Header: "Description",
    accessor: "description",
  },

  {
    Header: "Amount",
    accessor: "amount_paid",
  },

  {
    Header: "Payment Method",
    accessor: "payment_method",
  },

  {
    Header: "Date",
    accessor: (row) => dayjs(row?.paid_date).format("MMM D, YYYY h:mm A"),
  },

  {
    Header: "Status",
    accessor: "status",
    Cell: ({ row: { original } }) => (
      <TransactionTableItem value={original.status} />
    ),
  },
];

const AmtOfTransactions = () => {
  const user = useAppSelector((state) => state.auth.user);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const columns = useMemo(() => transactionsHistoryColumns, []);
  const [selectedPayment, setSelectedPayment] = useState<IPaymentLinkResItem>();

  const { data, isLoading } = useGetUserTransactionsQuery({
    wallet_id: user?.wallet?.wallet_id,
  });

  const selectPayment = (payment: any) => {
    setSelectedPayment(payment);
    onOpen();
  };

  return (
    <Layout>
      <PaymentItemModal
        isOpen={isOpen}
        onClose={onClose}
        paymentItem={selectedPayment}
      />

      <Flex justify='flex-end'>
        <CustomBtn>
          <CSVLink data={usersData} target='_blank'>
            Export to CSV
          </CSVLink>
        </CustomBtn>
      </Flex>

      <Box mt={10}>
        {isLoading ? (
          <AppLoader />
        ) : (
          <CustomTable
            data={data?.data ?? []}
            columns={columns}
            title='Transactions'
            search
            rowClickAction={(val) => selectPayment(val)}
          />
        )}
      </Box>
    </Layout>
  );
};

export default AmtOfTransactions;
