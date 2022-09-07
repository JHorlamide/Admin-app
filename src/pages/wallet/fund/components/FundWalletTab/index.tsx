import { VStack, Flex } from '@chakra-ui/react';
import React, { useState } from 'react';
import CustomBtn from '@/components/CustomBtn';
import CustomInput from '@/components/CustomInput';
import { useRouter } from 'next/router';
import styles from './style.module.scss';
import toast from "react-hot-toast";
import {useFundWalletMutation} from "@/redux/api/walletSlice"
import payWithMonnify from 'src/helpers/payWithMonnify';
import { useAppSelector } from '@/hooks/reduxHooks';



const FundWalletTab = () => {
  const router = useRouter();
  const [amt, setAmt] = useState<string>('');
  const user = useAppSelector((state) => state.auth.user);

  const [fundWallet, { isLoading, isError }] = useFundWalletMutation();

  const showSuccess = () => {
    router.push("/");
    toast.success("Transaction successful!");
  };

  const showError = () => {
    toast.error("Transaction could not be completed");
  };

  const handlePayment = async () => {
    try {
      payWithMonnify({
        customerEmail: user?.email as string,
        customerName: user?.name || (user?.entity_name as string),
        amount: Number(amt),
        walletId: user?.wallet?.wallet_id as string,
        runFunc: fundWallet,
        showSuccess,
        showError,
      });
      setAmt("");
    } catch (error) {
      console.log(error);
      toast.error("Transaction could not be completed");
    }
  };

  return (
    <Flex justifyContent={"center"}>
      <VStack
        w='500px'
        bg='white'
        borderRadius='6px'
        className={styles.container}
        px={[4, 6, 8]}
        py={[6, 6, 8]}
      >
        <CustomInput
          id='amount'
          label='Amount'
          inputProps={{
            placeholder: '.e.g 5000',
            type: 'number',
            value: amt,
            onChange: (e) => setAmt(e.target.value),
          }}
        />

        <CustomBtn
          mt={[4]}
          onClick={handlePayment}
          isDisabled={!amt}
          isFullWidth
          isLoading={isLoading}
          iserror={isError}
        >
          Add Funds
        </CustomBtn>
      </VStack>
    </Flex>
  );
};

export default FundWalletTab;
