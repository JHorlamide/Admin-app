import { Flex, Text } from "@chakra-ui/react";

type Props = {
  left: string;
  right: string;
};

const TransferDetail = ({ left, right }: Props) => {
  return (
    <Flex
      align="center"
      justify="space-between"
      bg="#f1f1f1"
      borderRadius="12px"
      px="6"
      py="4"
      w="full"
    >
      <Text color="textFour" fontWeight="500" fontSize={["0.75rem", "1rem"]}>
        {left}
      </Text>
      <Text color="#424543" fontWeight="500" fontSize={["0.75rem", "1rem"]}>
        {right}
      </Text>
    </Flex>
  );
};

export default TransferDetail;
