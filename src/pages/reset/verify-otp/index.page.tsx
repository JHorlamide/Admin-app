import GuestLayout from "@/components/GuestLayout";
import { useVerifyResetPasswordOtpMutation } from "@/redux/api/resetApiSlice";
import {
  Box,
  Button,
  Heading,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import OtpInput from "react-otp-input";
import styles from "../../login/verify/Verify.module.scss";

const VerifyOtp: NextPage = () => {
  const [otp, setOtp] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>();

  const router = useRouter();

  const handleOtpChange = (val: string) => {
    setOtp(val);
  };

  const [verifyResetOtp, { isLoading, isError }] =
    useVerifyResetPasswordOtpMutation();

  const handleVerify = async () => {
    if (!userEmail) return;

    try {
      const res = await verifyResetOtp({
        email: userEmail,
        otp,
      }).unwrap();

      toast.success(res?.message);

      router.push(`/reset/verify?email=${userEmail}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (router.query.email) {
      setUserEmail(router.query.email as string);
    } else {
      router.replace("/reset");
    }
  }, [router.query]);

  return (
    <GuestLayout>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6} w='full'>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>ENTER OTP</Heading>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
            w='full'
          >
            <Box>
              <OtpInput
                value={otp}
                onChange={handleOtpChange}
                numInputs={4}
                containerStyle={styles.otp_container}
                inputStyle={styles.otp_input}
                focusStyle={styles.otp_input_focus}
                isInputSecure
              />
            </Box>
            <Button
              isFullWidth
              mt='8'
              bg='green.500'
              color='white'
              isDisabled={otp.length < 4}
              isLoading={isLoading}
              onClick={handleVerify}
            >
              Submit
            </Button>
          </Box>
        </Stack>
      </Stack>
    </GuestLayout>
  );
};

export default VerifyOtp;
