import { useAppSelector } from "@/hooks/reduxHooks";
import { useApprovePayrollMutation } from "@/redux/api/payrollApiSlice";
import { useSendPensionOtpMutation } from "@/redux/api/pensionSlice";
import { IPayrollItem } from "@/types/payroll";
import { Heading, Modal, ModalContent, ModalOverlay, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import numeral from "numeral";
import CustomBtn from "src/components/CustomBtn";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  payroll: IPayrollItem | undefined;
  bankAction?: () => Promise<void>;
};

const RemittanceModal = ({ isOpen, onClose, payroll, bankAction }: Props) => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const hasFunds = Number(user?.wallet?.available_balance) >= Number(payroll?.total_amount);
  const [sendApprovalOtp, { isLoading, isError }] = useApprovePayrollMutation();

  const payNow = async () => {
    try {
      await sendApprovalOtp({
        salary_id: payroll?.salary_id as string,
      }).unwrap();
      sessionStorage.setItem("tpay_payroll_item_ref", payroll?.salary_id as string);
      router.push("/payroll/verify");
    } catch (error) {
      console.log(error);
    }
  };

  const btnAction = hasFunds ? () => payNow() : () => router.push("/wallet/fund");

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent
        mx={[4, 0]}
        maxW="490"
        w="full"
        bg="white"
        borderRadius="6px"
        className="appBox"
        px={[4, 6, 8]}
        py={[6, 6, 8]}
      >
        <Heading
          as="h3"
          color="textOne"
          fontWeight="600"
          fontSize={["1.2rem", "1.5rem"]}
          textAlign="center"
        >
          Choose a payment method
        </Heading>

        {hasFunds ? (
          <></>
        ) : (
          <Text textAlign="center" mt={[4]} color="redOne" fontWeight="600">
            Insufficient wallet balance: ₦
            {numeral(user?.wallet?.available_balance).format("0,0.00")}
          </Text>
        )}
        <VStack mt={[4]} spacing={[4, 6]}>
          <CustomBtn isFullWidth onClick={btnAction} isLoading={isLoading} iserror={isError}>
            {hasFunds ? "Pay Now" : "Fund Wallet"}
          </CustomBtn>
          <CustomBtn light isFullWidth onClick={bankAction} isDisabled={isLoading}>
            Direct Bank Transfer
          </CustomBtn>
        </VStack>
      </ModalContent>
    </Modal>
  );
};

export default RemittanceModal;
