import { Input, InputProps } from "@chakra-ui/react";

const LoginInput = (props: InputProps) => {
  return (
    <Input
      border="1px solid #F2F0FB"
      borderRadius="3px"
      px="5"
      color="textTwo"
      w="full"
      fontSize="15px"
      size="lg"
      fontFamily="poppins"
      {...props}
      className="loginInput"
    />
  );
};

export default LoginInput;
