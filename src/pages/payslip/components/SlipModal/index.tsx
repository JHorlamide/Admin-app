import { useAppSelector } from "@/hooks/reduxHooks";
import { useSendPensionOtpMutation } from "@/redux/api/pensionSlice";
import { ISlip } from "@/types/payslips";
import { IPensionItem } from "@/types/pensions";
import {
  Flex,
  Heading,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import numeral from "numeral";
import { useMemo } from "react";
import CustomBtn from "src/components/CustomBtn";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  slip: ISlip | undefined;
};

type SlipModalItemProps = {
  left: string;
  right: string | undefined | null;
};

const SlipModalItem = ({ left, right }: SlipModalItemProps) => {
  return (
    <Flex
      align="center"
      justify="space-between"
      w="full"
      bg="#f1f1f1"
      borderRadius="12px"
      px="5"
      py="4"
      gap="8"
    >
      <Text
        color="textFour"
        fontWeight="500"
        fontSize={["0.875rem", "1rem"]}
        textTransform="capitalize"
      >
        {left.replaceAll("_", " ")}
      </Text>
      <Text color="textSix" fontWeight="500" fontSize={["0.875rem", "1rem"]}>
        {right}
      </Text>
    </Flex>
  );
};

const SlipModal = ({ isOpen, onClose, slip }: Props) => {
  const router = useRouter();

  const user = useAppSelector((state) => state.auth.user);

  const slipKeys = useMemo(() => (slip ? Object.keys(slip) : []), [slip]);
  const slipVals = useMemo(() => (slip ? Object.values(slip) : []), [slip]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom" scrollBehavior="outside">
      <ModalOverlay />
      <ModalContent
        mx={[4, 0]}
        maxW="700"
        w="full"
        bg="white"
        borderRadius="6px"
        className="appBox"
        px={[4, 6, 8]}
        py={[6, 6, 8]}
      >
        <ModalCloseButton />
        <Heading
          as="h3"
          color="textOne"
          fontWeight="600"
          fontSize={["1rem", "1.25rem"]}
          textAlign="center"
          mb={[4, 6]}
        >
          {slip?.employee_name} ({slip?.employee_email})
        </Heading>

        <VStack spacing={[4]}>
          {slipKeys.map((item, index) => (
            <SlipModalItem key={item} left={item} right={slipVals[index]} />
          ))}
        </VStack>
      </ModalContent>
    </Modal>
  );
};

export default SlipModal;
