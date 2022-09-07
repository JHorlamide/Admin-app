import { Box, Flex, Modal, ModalContent, ModalOverlay, Text, VStack } from "@chakra-ui/react";
import Image from "next/image";
import CustomBtn from "src/components/CustomBtn";
import successIcon from "@/public/images/success.svg";
import numeral from "numeral";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const PayrollSuccessModal = ({ isOpen, onClose }: Props) => {
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
        <Box position="relative" w="70px" h="70px">
          <Image alt="success-icon" src={successIcon} />
        </Box>

        <Text color="textThree" fontSize={["1.75rem", "2rem"]} mt={[5]} fontWeight="600">
          Success
        </Text>

        <Text color="textThree" fontSize={["1.125rem", "1.25rem"]} mt={[3]}>
          The payroll task has been added successfully, and a notification has been sent to your
          email.
        </Text>

        <CustomBtn light isFullWidth mt="6" onClick={onClose}>
          Okay
        </CustomBtn>
      </ModalContent>
    </Modal>
  );
};

export default PayrollSuccessModal;
