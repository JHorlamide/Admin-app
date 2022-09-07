import { NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { Box, Flex, Grid, useDisclosure } from "@chakra-ui/react";
import UserDetail from "@/components/UserDetail";
import { nanoid } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { IUserWallet } from "@/types/pfas";
import CustomBtn from "@/components/CustomBtn";
import { StringOrNull } from "@/types/user";
import { IUserNotification } from "@/types/notifications";
import toast from "react-hot-toast";
import {
  useGetUserDetailsQuery,
  useDeactivateUserMutation,
  useActivateUserMutation,
} from "@/redux/api/userApiSlice";
import AppLoader from "@/components/AppLoader";
import Wallet from "../components/wallet";
import FundWallet from "../components/FundWallet/index";
import checkUserRole from "src/helpers/checkUserRole";
import { useAppSelector } from "@/hooks/reduxHooks";

export type UserValueType = (
  | boolean
  | StringOrNull
  | string[]
  | IUserNotification[]
  | IUserWallet
)[];

const UserPage: NextPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const userRole = checkUserRole(user);
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { data: user_data, isLoading } = useGetUserDetailsQuery({ _id: id });
  const [deactivateUser] = useDeactivateUserMutation();
  const [activateUser] = useActivateUserMutation();
  const wallet_id = user_data?.data.wallet.wallet_id;
  const { isOpen, onOpen, onClose } = useDisclosure();

  console.log("USER ROLE: ", user);

  const {
    isOpen: isFundWalletOpen,
    onOpen: onFundWalletOpen,
    onClose: onFundWalletClose,
  } = useDisclosure();

  const formattedUser = useMemo(() => {
    const copied = { ...user_data?.data?.user };
    delete copied.notifications;
    const walletObj = copied.wallet;
    const merged = { ...copied, ...walletObj };

    return merged;
  }, [user_data]);

  const userKeys: string[] = useMemo(
    () => Object.keys(formattedUser),
    [formattedUser]
  );

  const userValues = useMemo(
    () => Object.values(formattedUser),
    [formattedUser]
  );

  const activateUserHandler = async () => {
    try {
      const response = await activateUser({ _id: id }).unwrap();
      if (Number(response.code) === 200) {
        toast.success(response.message);
        return;
      }

      toast.error(response.message);
    } catch (error) {
      console.log(error);
    }
  };

  const deactivateUserHandler = async () => {
    try {
      const response = await deactivateUser({ _id: id }).unwrap();
      if (Number(response.code) === 200) {
        toast.success(response.message);
        return;
      }

      toast.error(response.message);
    } catch (error) {
      console.log(error);
    }
  };

  const showTransactions = () => {
    router.push({
      pathname: `/users/${id}/transactions`,
      query: { wallet_id },
    });
  };

  return (
    <Layout>
      <Box my='4'>
        <Flex justify='flex-end' gap='4'>
          <Wallet
            isOpen={isOpen}
            onClose={onClose}
            wallet_details={user_data?.data.wallet}
          />

          <FundWallet
            isOpen={isFundWalletOpen}
            onClose={onFundWalletClose}
            wallet_id={wallet_id}
          />

          {userRole !== "finance" && userRole !== "approver" ? (
            <CustomBtn bg='greenTwo' onClick={onFundWalletOpen}>
              Fund User Wallet
            </CustomBtn>
          ) : null}

          {user_data?.data.user.is_deactivated ? (
            <CustomBtn bg='greenOne' onClick={activateUserHandler}>
              Activate User
            </CustomBtn>
          ) : (
            <CustomBtn bg='redOne' onClick={deactivateUserHandler}>
              Deactivate User
            </CustomBtn>
          )}

          <CustomBtn bg='greyOne' onClick={onOpen}>
            Reveal Wallet Details
          </CustomBtn>

          <CustomBtn
            bg='greenTwo'
            onClick={showTransactions}
          >
            Transactions
          </CustomBtn>
        </Flex>

        {isLoading ? (
          <AppLoader />
        ) : (
          <Grid templateColumns={["1fr"]} gridGap='4' mt='4'>
            {userKeys.map((userItem, index) => (
              <UserDetail
                key={nanoid()}
                left={userItem}
                right={userValues[index] as UserValueType}
              />
            ))}
          </Grid>
        )}
      </Box>
    </Layout>
  );
};

export default UserPage;
