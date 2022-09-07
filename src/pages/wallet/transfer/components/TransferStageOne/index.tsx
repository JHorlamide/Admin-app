import CustomBtn from "@/components/CustomBtn";
import CustomInput from "@/components/CustomInput";
import { useAppSelector } from "@/hooks/reduxHooks";
import {
  useBankTransferMutation,
  useGetAllBanksQuery,
  useValidateAcctNumberQuery,
  useWalletTransferMutation,
} from "@/redux/api/walletSlice";
import { ITransferResponse } from "@/types/wallet";
import { accountTransferSchema, walletTransferSchema } from "src/validation/wallet.validation";
import { Box, Grid, Spinner, Text, VStack } from "@chakra-ui/react";
import { FormikHelpers, useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TxnType } from "../../index.page";

type Props = {
  txnType: "wallet" | "account";
  goForward: (details: ITransferResponse, txnType: TxnType) => void;
};

interface IWalletFormValues {
  receiver_email: string;
  amount: string;
  description: string;
}

interface IAccountFormValues {
  account_number: string;
  // account_name: string;
  bank_name: string;
  amount: string;
  description: string;
}

const TransferStageOne = ({ txnType, goForward }: Props) => {
  const user = useAppSelector((state) => state.auth.user);

  const [beneficiary, setBeneficiary] = useState<string | undefined>(undefined);

  const initialWalletValues: IWalletFormValues = {
    receiver_email: "",
    amount: "",
    description: "",
  };

  const initialAccountValues: IAccountFormValues = {
    bank_name: "",
    // account_name: "",
    account_number: "",
    amount: "",
    description: "",
  };

  const router = useRouter();

  const goBackToWallet = () => {
    router.push("/");
  };

  const { data: banksData, isLoading, isError } = useGetAllBanksQuery();

  const [walletTransfer, { isLoading: isLoadingWallet, isError: isErrorWallet }] =
    useWalletTransferMutation();
  const [bankTransfer, { isLoading: isLoadingBank, isError: isErrorBank }] =
    useBankTransferMutation();

  const handleWalletTransfer = async (
    values: IWalletFormValues,
    actions: FormikHelpers<IWalletFormValues>
  ) => {
    // const fee = `${(5 / 100) * Number(values.amount)}`;
    const fee = "0";
    const total_amount = `${Number(values.amount) + Number(fee)}`;

    try {
      const res = await walletTransfer({
        receiver_email: values.receiver_email,
        description: values.description,
        amount: values.amount,
        wallet_id: user?.wallet?.wallet_id as string,
        fee,
        total_amount,
      }).unwrap();

      toast.success(res?.message);

      goForward(res, "wallet");

      actions.resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccountTransfer = async (
    values: IAccountFormValues,
    actions: FormikHelpers<IAccountFormValues>
  ) => {
    if (!dataValidate) return;

    // const fee = `${(5 / 100) * Number(values.amount)}`;
    const total_amount = `${Number(values.amount)}`;

    try {
      const res = await bankTransfer({
        account_number: values.account_number,
        account_name: dataValidate?.data?.accountName as string,
        bank_name: values.bank_name,
        bank_code: dataValidate?.data?.bankCode as string,
        fee: "0",
        amount: values.amount,
        total_amount,
        description: values.description,
        wallet_id: user?.wallet?.wallet_id as string,
      }).unwrap();

      toast.success(res?.message);

      goForward(res, "account");

      actions.resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  const {
    values: walletValues,
    errors: walletErrors,
    touched: walletTouched,
    handleChange: walletHandleChange,
    handleBlur: walletHandleBlur,
    handleSubmit: walletHandleSubmit,
  } = useFormik({
    validationSchema: walletTransferSchema,
    initialValues: initialWalletValues,
    onSubmit: handleWalletTransfer,
  });

  const {
    values: accountValues,
    errors: accountErrors,
    touched: accountTouched,
    handleChange: accountHandleChange,
    handleBlur: accountHandleBlur,
    handleSubmit: accountHandleSubmit,
  } = useFormik({
    initialValues: initialAccountValues,
    validationSchema: accountTransferSchema,
    onSubmit: handleAccountTransfer,
  });

  const {
    data: dataValidate,
    isLoading: isLoadingValidate,
    isFetching: isFetchingValidate,
    refetch: refetchValidate,
    isError: isErrorValidate,
  } = useValidateAcctNumberQuery(
    {
      accountNumber: accountValues.account_number,
      bankCode: banksData?.data.banks.find(
        (bank: any) => bank.name.toLowerCase() === accountValues.bank_name.toLowerCase()
      )?.code as string,
    },
    {
      skip: !accountValues.account_number || !accountValues.bank_name,
    }
  );

  useEffect(() => {
    console.log("doing");
    if (!accountValues.account_number || !accountValues.bank_name) return;

    refetchValidate();
  }, [accountValues.account_number, accountValues.bank_name]);

  // console.log({ dataValidate, isLoadingValidate, isErrorValidate });

  return txnType === "account" ? (
    <form onSubmit={accountHandleSubmit}>
      <VStack spacing={[4, 5]}>
        <CustomInput
          id="amount"
          label="Amount"
          inputProps={{
            placeholder: "E.g 10,000",
            value: accountValues.amount,
            onChange: accountHandleChange,
            onBlur: accountHandleBlur("amount"),
            isInvalid: accountErrors.amount && accountTouched.amount ? true : false,
            type: "number",
          }}
          errorText={accountErrors.amount && accountTouched.amount ? accountErrors.amount : null}
        />
        <CustomInput
          id="bank_name"
          label="Bank"
          selectProps={{
            placeholder: "E.g GTB",
            value: accountValues.bank_name,
            onChange: accountHandleChange,
            onBlur: accountHandleBlur("bank_name"),
            isInvalid: accountErrors.bank_name && accountTouched.bank_name ? true : false,
          }}
          selectOptions={banksData ? banksData?.data?.banks : []}
          errorText={
            accountErrors.bank_name && accountTouched.bank_name ? accountErrors.bank_name : null
          }
          select
          selectLoading={isLoadingBank}
        />
        <CustomInput
          id="account_number"
          label="Account number"
          inputProps={{
            placeholder: "E.g 0723371427",
            value: accountValues.account_number,
            onChange: accountHandleChange,
            onBlur: accountHandleBlur("account_number"),
            isInvalid: accountErrors.account_number && accountTouched.account_number ? true : false,
          }}
          errorText={
            accountErrors.account_number && accountTouched.account_number
              ? accountErrors.account_number
              : null
          }
        />
        {dataValidate?.data?.accountName || isLoadingValidate || isFetchingValidate ? (
          <Box w="full">
            <Text
              textAlign="left"
              color="#171717"
              fontSize=".875rem"
              fontWeight="500"
              fontFamily="poppins"
            >
              Beneficiary
            </Text>
            <Box
              border="none"
              borderRadius="8px"
              p="4"
              color="textOne"
              w="full"
              fontSize="0.875rem"
              bg="#EFF0F6"
              fontFamily="poppins"
              mt="2"
            >
              {isLoadingValidate || isFetchingValidate ? (
                <Spinner />
              ) : (
                dataValidate?.data?.accountName
              )}
            </Box>
          </Box>
        ) : null}
        <CustomInput
          id="description"
          label="Description (optional)"
          boxProps={{
            placeholder: "E.g Food",
            value: accountValues.description,
            onChange: accountHandleChange,
            onBlur: accountHandleBlur("description"),
            isInvalid: accountErrors.description && accountTouched.description ? true : false,
          }}
          errorText={
            accountErrors.description && accountTouched.description
              ? accountErrors.description
              : null
          }
          box
        />
      </VStack>
      <Grid templateColumns={["1fr", "1fr 1fr"]} gap={[4, 3]} mt={[6, 10]}>
        <CustomBtn type="submit" isLoading={isLoadingBank} iserror={isErrorBank}>
          Next
        </CustomBtn>
        <CustomBtn onClick={goBackToWallet} light isDisabled={isLoadingBank}>
          Cancel
        </CustomBtn>
      </Grid>
    </form>
  ) : (
    <form onSubmit={walletHandleSubmit}>
      <VStack spacing={[4, 5]}>
        <CustomInput
          id="receiver_email"
          label="Recipient email"
          inputProps={{
            placeholder: "E.g john@mail.com",
            type: "email",
            value: walletValues.receiver_email,
            onChange: walletHandleChange,
            onBlur: walletHandleBlur("receiver_email"),
            isInvalid: walletErrors.receiver_email && walletTouched.receiver_email ? true : false,
          }}
          errorText={
            walletErrors.receiver_email && walletTouched.receiver_email
              ? walletErrors.receiver_email
              : null
          }
        />
        <CustomInput
          id="amount"
          label="Amount"
          inputProps={{
            placeholder: "E.g N10,000",
            value: walletValues.amount,
            onChange: walletHandleChange,
            onBlur: walletHandleBlur("amount"),
            isInvalid: walletErrors.amount && walletTouched.amount ? true : false,
            type: "number",
          }}
          errorText={walletErrors.amount && walletTouched.amount ? walletErrors.amount : null}
        />
        <CustomInput
          id="description"
          label="Description (optional)"
          boxProps={{
            placeholder: "E.g Food",
            value: walletValues.description,
            onChange: walletHandleChange,
            onBlur: walletHandleBlur("description"),
            isInvalid: walletErrors.description && walletTouched.description ? true : false,
          }}
          errorText={
            walletErrors.description && walletTouched.description ? walletErrors.description : null
          }
          box
        />
      </VStack>
      <Grid templateColumns={["1fr"]} gap={[4, 6]} mt={[6, 10]}>
        <CustomBtn type="submit" isLoading={isLoadingWallet} iserror={isErrorWallet}>
          Next
        </CustomBtn>
        <CustomBtn onClick={goBackToWallet} light isDisabled={isLoadingWallet}>
          Cancel
        </CustomBtn>
      </Grid>
    </form>
  );
};

export default TransferStageOne;
