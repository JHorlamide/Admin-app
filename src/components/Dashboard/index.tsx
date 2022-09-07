import {
  Box,
  chakra,
  SimpleGrid,
  Divider,
  Center,
  useDisclosure,
} from "@chakra-ui/react";
import { BsPerson } from "react-icons/bs";
import { useRouter } from "next/router";
import { AiOutlineTransaction } from "react-icons/ai";
import { FaSortAmountUpAlt } from "react-icons/fa";
import { GiOrganigram, GiMoneyStack, GiProfit, GiWallet } from "react-icons/gi";
import {
  MdNoAccounts,
  MdOutlineAccountBalanceWallet,
  MdDynamicFeed,
} from "react-icons/md";
import StatsCard from "@/components/StatsCard/index";
import numeral from "numeral";
import {
  useGetMonnifyWalletBalanceQuery,
  useGetAmountOfTransactionsQuery,
  useGetTotalNumberOfTransactionQuery,
  useGetTotalWalletBalanceQuery,
} from "@/redux/api/walletSlice";
import { useGetTotalUserQuery } from "@/redux/api/userApiSlice";
import { useGetAllPfaQuery } from "@/redux/api/pfasApiSlice";
import TransactionDetailModal from "./TransactionDetailModal/index";

const Dashboard = () => {
  const router = useRouter();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const {
    data: MonnifyWalletBalance,
    isLoading: isLoadingMonnifyWalletBalance,
  } = useGetMonnifyWalletBalanceQuery();

  const { data: TransactionAmt, isLoading: isLoadingTransactionAmt } =
    useGetAmountOfTransactionsQuery();

  const { data: TotalTransactions, isLoading: isLoadingTotalNoOfTransactions } =
    useGetTotalNumberOfTransactionQuery();

  const { data: TotalWalletBalance, isLoading: isLoadingWalletBalance } =
    useGetTotalWalletBalanceQuery();

  const { data: TotalUser, isLoading: isLoadingTotalUser } =
    useGetTotalUserQuery();

  const { data: TotalPFA, isLoading: isLoadingPfa } = useGetAllPfaQuery();

  // MONNIFY WALLET BALANCE
  const monnifyWalBalance = numeral(
    Number(MonnifyWalletBalance?.data.availableBalance)
  ).format("0,0.00");

  // TOTAL NUMBER OF TRANSACTION
  const totalTransactions = String(
    numeral(Number(TotalTransactions?.data.count)).value()
  );

  // TOTAL WALLET BALANCE
  const totalWalletBalance = numeral(
    Number(TotalWalletBalance?.data.totalBalance)
  ).format("0,0.00");

  const transactionDetail = {
    credit: TransactionAmt?.data.count.credit,
    debit: TransactionAmt?.data.count.debit,
    totalCredit: TransactionAmt?.data.total.totalCredit,
    totalDebit: TransactionAmt?.data.total.totalDebit,
  };

  const selectTransactionDetail = () => {
    onOpen();
  };

  return (
    <Box maxW='7xl' mx={"auto"} pt={0} px={{ base: 2, sm: 12, md: 17 }}>
      <TransactionDetailModal
        isOpen={isOpen}
        onClose={onClose}
        transactionDetail={transactionDetail}
      />

      <chakra.h1 textAlign={"left"} fontSize={"4xl"} py={2} fontWeight={"bold"}>
        Statistics
      </chakra.h1>

      <SimpleGrid columns={{ base: 2, md: 3 }} spacing={{ base: 5, lg: 8 }}>
        <StatsCard
          title={"Amount of Transactions"}
          stat={"Click to see detail"}
          icon={<FaSortAmountUpAlt size={"3em"} />}
          select={selectTransactionDetail}
          hover='pointer'
        />

        <StatsCard
          title={"Profit for Transactions"}
          stat={"0.00"}
          icon={<GiProfit size={"3em"} />}
          select={() => router.push("/transaction-profit")}
          hover='pointer'
          text={"₦"}
        />

        <StatsCard
          title={"View Wallet balances"}
          stat={"0.00"}
          icon={<GiWallet size={"3em"} />}
          select={() => router.push("/wallet-balance")}
          hover='pointer'
          text={"₦"}
        />
      </SimpleGrid>

      <Center>
        <Divider m={10} sx={{ fontSize: 50 }} />
      </Center>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
        <StatsCard
          title={"Total Users"}
          stat={TotalUser?.data.users}
          icon={<BsPerson size={"3em"} />}
          isloading={isLoadingTotalUser}
        />

        <StatsCard
          title={"Total Deactivated Users"}
          stat={TotalUser?.data.deactivated}
          icon={<BsPerson size={"3em"} />}
          isloading={isLoadingTotalUser}
        />

        <StatsCard
          title={"Total PFAs"}
          stat={TotalPFA?.data.count}
          icon={<GiOrganigram size={"3em"} />}
          isloading={isLoadingPfa}
        />

        <StatsCard
          title={"Total Locked Accounts"}
          stat={TotalUser?.data.locked}
          icon={<MdNoAccounts size={"3em"} />}
          isloading={isLoadingTotalUser}
        />

        <StatsCard
          title={"Monnify Wallet balance"}
          stat={monnifyWalBalance}
          icon={<GiMoneyStack size={"3em"} />}
          isloading={isLoadingMonnifyWalletBalance}
          text={"₦"}
        />

        <StatsCard
          title={"Total Wallet Balance"}
          stat={totalWalletBalance}
          icon={<GiWallet size={"3em"} />}
          text={"₦"}
        />

        <StatsCard
          title={"Volume of Transactions"}
          stat={totalTransactions}
          icon={<AiOutlineTransaction size={"3em"} />}
          isloading={isLoadingTotalNoOfTransactions}
        />

        <StatsCard
          title={"Monnify Fees for Transactions"}
          stat={"0"}
          icon={<MdDynamicFeed size={"3em"} />}
          text={"₦"}
        />
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;
