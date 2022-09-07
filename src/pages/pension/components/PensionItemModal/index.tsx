import CustomBtn from "@/components/CustomBtn";
import { useAppSelector } from "@/hooks/reduxHooks";
import { IPensionItem } from "@/types/pensions";
import {
  Box,
  Flex,
  Grid,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import numeral from "numeral";
import checkUserRole from "src/helpers/checkUserRole";
import checkUserType from "src/helpers/checkUserType";
import PensionTableItem from "src/components/PensionTableItem/index";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  pension: IPensionItem | undefined;
  approveAction: () => void;
  rejectAction: (val: string) => Promise<void>;
  rejectLoading: boolean;
  rejectError: boolean;
};

const PensionItemModal = ({
  isOpen,
  onClose,
  pension,
  approveAction,
  rejectAction,
  rejectLoading,
  rejectError,
}: Props) => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom" scrollBehavior="outside">
      <ModalOverlay />
      <ModalContent
        mx={[4, 0]}
        maxW="590"
        // maxH="820"
        w="full"
        bg="white"
        borderRadius="6px"
        className="appBox"
        px={[4, 6, 8]}
        py={[6, 6, 8]}
      >
        <ModalCloseButton />
        <Box display={["flex", "block"]} flexDirection="column" justifyContent="center">
          <Text color="textFour" fontWeight="500" fontSize={["0.875rem"]} textAlign="center">
            TOTAL AMOUNT
          </Text>
          <Text color="textOne" fontSize={["1.5rem"]} fontWeight="600" textAlign="center">
            <Text
              as="span"
              fontWeight="600"
              color="textOne"
              verticalAlign="top"
              fontSize={["0.8rem"]}
              position="relative"
              top="4px"
              right="2px"
            >
              NGN
            </Text>
            {numeral(pension?.total_amount).format("0,0.00")}
          </Text>
        </Box>

        <Flex w="full" align="center" justify="space-between" mt={[6, 8]}>
          <Text
            color="textOne"
            fontWeight="600"
            fontSize={["0.875rem"]}
            py="1"
            px="3"
            bg="#e8e8e8"
            borderRadius="8px"
          >
            PENSION STATUS
          </Text>
          <PensionTableItem value={pension?.status as string} />
        </Flex>

        <VStack mt={[6, 8]} spacing={4}>
          <Flex
            align="center"
            justify="space-between"
            w="full"
            bg="#f1f1f1"
            borderRadius="12px"
            px="5"
            py="4"
          >
            <Text color="textFour" fontWeight="500" fontSize={["0.875rem", "1rem"]}>
              Initiator
            </Text>
            <Text color="textSix" fontWeight="500">
              {!pension?.initiator?.first_name || !pension?.initiator?.last_name
                ? pension?.employer || "--- ---"
                : `${pension?.initiator?.first_name} ${pension?.initiator?.last_name}`}
            </Text>
          </Flex>

          {pension?.approver ? (
            <Flex
              align="center"
              justify="space-between"
              w="full"
              bg="#f1f1f1"
              borderRadius="12px"
              px="5"
              py="4"
            >
              <Text color="textFour" fontWeight="500" fontSize={["0.875rem", "1rem"]}>
                Approver
              </Text>
              
              <Text color="textSix" fontWeight="500">
                {!pension?.approver?.first_name || !pension?.approver?.last_name
                  ? pension?.employer || user?.entity_name
                  : `${pension?.approver?.first_name} ${pension?.approver?.last_name}`}
              </Text>
            </Flex>
          ) : null}

          <Flex
            align="center"
            justify="space-between"
            w="full"
            bg="#f1f1f1"
            borderRadius="12px"
            px="5"
            py="4"
          >
            <Text color="textFour" fontWeight="500" fontSize={["0.875rem", "1rem"]}>
              Pension reference
            </Text>
            <Text color="textSix" fontWeight="500">
              {pension?.pension_ref}
            </Text>
          </Flex>

          <Flex
            align="center"
            justify="space-between"
            w="full"
            bg="#f1f1f1"
            borderRadius="12px"
            px="5"
            py="4"
          >
            <Text color="textFour" fontWeight="500" fontSize={["0.875rem", "1rem"]}>
              Amount
            </Text>
            <Text color="textSix" fontWeight="500">
              ₦{numeral(pension?.amount).format("0,0.00")}
            </Text>
          </Flex>

          <Flex
            align="center"
            justify="space-between"
            w="full"
            bg="#f1f1f1"
            borderRadius="12px"
            px="5"
            py="4"
          >
            <Text color="textFour" fontWeight="500" fontSize={["0.875rem", "1rem"]}>
              Transaction fee
            </Text>
            <Text color="textSix" fontWeight="500">
              ₦{numeral(pension?.transaction_fee).format("0,0.00")}
            </Text>
          </Flex>

          <Flex
            align="center"
            justify="space-between"
            w="full"
            bg="#f1f1f1"
            borderRadius="12px"
            px="5"
            py="4"
          >
            <Text color="textFour" fontWeight="500" fontSize={["0.875rem", "1rem"]}>
              Date created
            </Text>
            <Text color="textSix" fontWeight="500">
              {dayjs(pension?.createdAt).format("MMM D, YYYY")}
            </Text>
          </Flex>

          {pension?.approvedDate ||
          pension?.approver ||
          pension?.status.toLowerCase() === "approved" ? (
            <Flex
              align="center"
              justify="space-between"
              w="full"
              bg="#f1f1f1"
              borderRadius="12px"
              px="5"
              py="4"
            >
              <Text color="textFour" fontWeight="500" fontSize={["0.875rem", "1rem"]}>
                Date approved
              </Text>
              <Text color="textSix" fontWeight="500">
                {dayjs(pension?.approvedDate).format("MMM D, YYYY")}
              </Text>
            </Flex>
          ) : null}

          {pension?.payment_method ? (
            <Flex
              align="center"
              justify="space-between"
              w="full"
              bg="#f1f1f1"
              borderRadius="12px"
              px="5"
              py="4"
            >
              <Text color="textFour" fontWeight="500" fontSize={["0.875rem", "1rem"]}>
                Payment method
              </Text>
              <Text color="textSix" fontWeight="500" textTransform="capitalize">
                {pension?.payment_method}
              </Text>
            </Flex>
          ) : null}
        </VStack>

        {pension?.approvedDate ||
        checkUserType(user) === "business" ||
        checkUserRole(user) === "approver" ||
        checkUserRole(user) === "finance" ? (
          <Grid templateColumns={["1fr", "1fr 1fr"]} gap={[4, 6]} mt={[6, 8]}>
            <CustomBtn onClick={approveAction} isDisabled={rejectLoading}>
              Approve
            </CustomBtn>
            <CustomBtn
              color="redOne"
              bg="rgba(239, 128, 147, 0.4)"
              onClick={() => rejectAction(pension?.pension_ref as string)}
              isLoading={rejectLoading}
              iserror={rejectError}
            >
              Reject
            </CustomBtn>
          </Grid>
        ) : null}

        <Box mt={[6, 8]} w="full">
          <CustomBtn light onClick={onClose} isFullWidth>
            Close
          </CustomBtn>
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default PensionItemModal;
