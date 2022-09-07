import { Box, Text, VStack } from "@chakra-ui/react";
import TransferDetail from "../TransferDetail";
import OtpInput from "react-otp-input";
import { useState } from "react";
import styles from "./style.module.scss";
import { ITransferResponse } from "@/types/wallet";
import { useResendOtpMutation, useVerifyTransferMutation } from "@/redux/api/walletSlice";
import toast from "react-hot-toast";
import CustomBtn from "@/components/CustomBtn";
import { route } from "next/dist/server/router";
import { useRouter } from "next/router";
import useTimer from "@/hooks/useTimer";
import numeral from "numeral";

type Props = {
  txnType: "wallet" | "account";
  walletTransferDetails: ITransferResponse | null;
  bankTransferDetails: ITransferResponse | null;
  resetDetails: () => void;
};

const TransferStageTwo = ({
  txnType,
  walletTransferDetails,
  bankTransferDetails,
  resetDetails,
}: Props) => {
  const [otp, setOtp] = useState<string>("");

  const router = useRouter();

  const handleOtpChange = (val: string) => {
    setOtp(val);
  };

  const [verifyTransfer, { isLoading, isError }] = useVerifyTransferMutation();
  const [resendOtp, { isLoading: isLoadingOtp, isError: isErrorOtp }] = useResendOtpMutation();

  const handleVerify = async () => {
    try {
      const res = await verifyTransfer({
        trans_ref:
          txnType === "wallet"
            ? (walletTransferDetails?.data?.transaction?.trans_ref as string)
            : (bankTransferDetails?.data?.transaction?.trans_ref as string),
        otp: otp.toUpperCase(),
        receiverType: txnType === "wallet" ? "wallet" : "bank",
      }).unwrap();

      toast.success("Transfer Successful!");

      router.replace("/");
      resetDetails();
    } catch (error) {
      console.log(error);
    }
  };

  const { seconds, reset } = useTimer(60);

  const handleResendOtp = async () => {
    try {
      const res = await resendOtp({
        trans_ref:
          txnType === "wallet"
            ? (walletTransferDetails?.data?.transaction?.trans_ref as string)
            : (bankTransferDetails?.data?.transaction?.trans_ref as string),
      }).unwrap();

      toast.success("OTP sent to your email");

      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <Text textAlign="center" color="textFour" fontWeight="500" fontSize={["0.875rem", "1rem"]}>
        YOU ARE SENDING
      </Text>
      <Text
        textAlign="center"
        color="black"
        fontWeight="600"
        fontSize={["1.75rem", "2rem", "2.25rem"]}
      >
        <Text
          as="span"
          fontSize={["1rem", "1.15rem"]}
          verticalAlign="top"
          color="black"
          fontWeight="600"
          position="relative"
          top={1.5}
          right={0.5}
        >
          NGN
        </Text>
        {`${Number(
          walletTransferDetails?.data?.transaction?.total_amount ||
            bankTransferDetails?.data?.transaction?.total_amount
        ).toFixed(2)}`}
      </Text>

      <VStack mt={[6, 10]} spacing={[2, 4]}>
        {txnType === "account" ? (
          <>
            <TransferDetail
              left="Account Name"
              right={bankTransferDetails?.data?.reciever?.account_name as string}
            />
            <TransferDetail
              left="Account Number"
              right={bankTransferDetails?.data?.reciever?.account_number as string}
            />
            <TransferDetail
              left="Bank"
              right={bankTransferDetails?.data?.reciever?.bank_name as string}
            />
            <TransferDetail
              left="Amount"
              right={`NGN${numeral(bankTransferDetails?.data?.transaction?.amount).format(
                "0,0.00"
              )}`}
            />
            <TransferDetail
              left="Transaction Fee"
              right={`NGN${numeral(Number(bankTransferDetails?.data?.transaction?.fee)).format(
                "0,0.00"
              )}`}
            />
          </>
        ) : (
          <>
            <TransferDetail left="To" right={`${walletTransferDetails?.data?.reciever?.name}`} />
            <TransferDetail
              left="Amount"
              right={`NGN${numeral(walletTransferDetails?.data?.transaction?.amount).format(
                "0,0.00"
              )}`}
            />
            <TransferDetail
              left="Transaction Fee"
              right={`NGN${numeral(Number(walletTransferDetails?.data?.transaction?.fee)).format(
                "0,0.00"
              )}`}
            />
          </>
        )}
      </VStack>

      <Text
        my={[6, 10]}
        textAlign="center"
        color="#000"
        fontWeight="500"
        fontSize={["0.875rem", "1rem"]}
      >
        Transaction PIN
      </Text>

      <Box>
        <OtpInput
          value={otp}
          onChange={handleOtpChange}
          numInputs={4}
          containerStyle={styles.otp_container}
          inputStyle={styles.otp_input}
          focusStyle={styles.otp_input_focus}
          isInputSecure
        />
      </Box>

      <CustomBtn
        disabled={otp.length < 4}
        isFullWidth
        onClick={handleVerify}
        mt="6"
        isLoading={isLoading}
        iserror={isError}
      >
        Confirm Transaction
      </CustomBtn>

      <CustomBtn
        light
        isFullWidth
        mt="4"
        isDisabled={seconds > 0}
        onClick={handleResendOtp}
        isLoading={isLoadingOtp}
        iserror={isErrorOtp}
      >
        Resend Code {seconds > 0 ? `00:${seconds <= 9 ? "0" : ""}${seconds}` : ""}
      </CustomBtn>
    </Box>
  );
};

export default TransferStageTwo;
