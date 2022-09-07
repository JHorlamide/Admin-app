import React, { useMemo, useState } from "react";
import numeral from "numeral";
import {
  Heading,
  Modal,
  ModalContent,
  ModalOverlay,
  Flex,
  Text,
  VStack,
  Grid,
  Box,
} from "@chakra-ui/react";
import CustomInput from "@/components/CustomInput";
import CustomBtn from "@/components/CustomBtn";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  wallet_id: string;
};

const Wallet = ({ isOpen, onClose, wallet_id }: Props) => {
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const isLoading = false;
  const isError = true;

  const handleFundWallet = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("WALLET ID: ", wallet_id);
  };

  return (
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
          fontSize={["1.2rem", "1.5rem"]}
          textAlign='center'
        >
          Fund Wallet
        </Heading>

        <form onSubmit={handleFundWallet}>
          <VStack spacing={[4, 5]}>
            <CustomInput
              pt={5}
              id='description'
              label='Enter Amount to fund'
              inputProps={{
                placeholder: "E.g 10,000",
                value: amount,
                onChange: (e) => setAmount(e.target.value),
              }}
            />

            <CustomInput
              id='description'
              label='Reason for funding wallet'
              boxProps={{
                placeholder: "E.g Food",
                value: description,
                onChange: (e) => setDescription(e.target.value),
              }}
              box
            />
          </VStack>

          <Box mt={[6, 5]}>
            <CustomBtn
              isFullWidth
              type='submit'
              disabled={!amount ? true : false}
              isLoading={isLoading}
              iserror={isError}
            >
              Next
            </CustomBtn>
          </Box>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default Wallet;
