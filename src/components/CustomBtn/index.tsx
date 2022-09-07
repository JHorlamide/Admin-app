import { Button, ButtonProps } from "@chakra-ui/react";
import React from "react";

interface CustomBtnProps extends ButtonProps {
  light?: boolean;
  iserror?: boolean;
}

const CustomBtn = ({ light, children, ...rest }: CustomBtnProps) => {
  return (
    <Button
      p="6"
      bg={light ? "greenLight" : "greenTwo"}
      color={light ? "greenTwo" : "white"}
      borderRadius="50"
      fontWeight="500"
      fontSize={["0.875rem", "1rem"]}
      minW="140"
      fontFamily="poppins"
      transition="all .2s ease-in-out"
      _hover={{
        transform: "scale(1.03)",
      }}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default CustomBtn;
