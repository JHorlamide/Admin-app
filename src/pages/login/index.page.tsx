import { NextPage } from "next";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  HStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FormEvent, useState } from "react";
import { CheckIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import GuestLayout from "@/components/GuestLayout";
import { useLoginUserMutation } from "@/redux/api/loginApiSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const Login: NextPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) return;

    try {
      const res = await loginUser({
        email,
        password,
      }).unwrap();

      if (typeof window !== "undefined") {
        sessionStorage.setItem("tpay_2fa_email", email);
      }

      if (rememberMe) {
        sessionStorage.setItem("tpay_admin_remember_me", "true");
      }

      toast.success(res.message);
      router.push("/login/verify");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <GuestLayout>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6} w='full'>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in</Heading>
        </Stack>

        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <form onSubmit={handleLogin}>
            <Stack spacing={4}>
              <FormControl id='email' isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={10}>
                <Flex
                  flexDirection={["column", "row"]}
                  gap={2}
                  align='center'
                  justify='space-between'
                  w='full'
                >
                  <HStack alignItems='center' spacing='6px'>
                    <Box
                      border='1px solid #ccc'
                      w='3'
                      h='3'
                      borderRadius={2}
                      cursor='pointer'
                      onClick={() => setRememberMe((prev) => !prev)}
                      position='relative'
                    >
                      {rememberMe ? (
                        <CheckIcon
                          fontSize='8px'
                          position='absolute'
                          top='50%'
                          left='50%'
                          transform='translate(-50%, -50%)'
                          color='green.500'
                        />
                      ) : (
                        <></>
                      )}
                    </Box>
                    <Text fontSize='14px'>Remember me</Text>
                  </HStack>
                  <NextLink href='/reset' passHref>
                    <Link
                      color='green.500'
                      fontSize='1rem'
                      fontWeight='600'
                      fontFamily='poppins'
                    >
                      Forgot Password
                    </Link>
                  </NextLink>
                </Flex>
                <Button
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  type='submit'
                  isLoading={isLoading}
                >
                  Sign in
                </Button>
              </Stack>
              {/* <Stack pt={6}>
                <Text align={"center"}>
                  {`Don't have an account? `}
                  <NextLink passHref href="/signup">
                    <Link color={"blue.400"}>Sign up</Link>
                  </NextLink>
                </Text>
              </Stack> */}
            </Stack>
          </form>
        </Box>
      </Stack>
    </GuestLayout>
  );
};

export default Login;
