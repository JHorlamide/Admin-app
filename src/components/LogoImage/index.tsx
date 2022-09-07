import { Box } from "@chakra-ui/react";
import taxitpayLogo from "@/public/images/taxitpay-logo.png";
import Image from "next/image";
import styles from "./LogoImage.module.scss";

const LogoImage = () => {
  return (
    <Box position="relative" w={[110, 130]}>
      <Image alt="taxitpay logo" src={taxitpayLogo} className={styles.img} />
    </Box>
  );
};

export default LogoImage;
