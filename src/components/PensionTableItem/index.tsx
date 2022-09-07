import { Text } from "@chakra-ui/react";
import React from "react";

type Props = {
  value: string;
};

const completionObj = [
  { text: "failed", bg: "rgba(239, 128, 147, 0.4)", color: "redOne" },
  { text: "declined", bg: "rgba(239, 128, 147, 0.4)", color: "redOne" },
  { text: "approved", bg: "rgba(75, 222, 151, 0.2)", color: "greenOne" },
  { text: "initiated", bg: "#FFF4CA", color: "#BE9800" },
  { text: "pending", bg: "#FFF4CA", color: "#BE9800" },
];

const PensionTableItem = ({ value }: Props) => {
  const valueData = completionObj.find((item) => item.text.toLowerCase() === value.toLowerCase());

  return (
    <Text
      fontSize={["0.75rem", "0.875rem"]}
      fontWeight="500"
      px="3"
      py="1"
      borderRadius="full"
      textAlign="center"
      bg={valueData?.bg}
      color={valueData?.color}
      textTransform="capitalize"
    >
      {value}
    </Text>
  );
};

export default PensionTableItem;
