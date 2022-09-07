import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const fonts = {
  poppins: `'Poppins', sans-serif`,
};

const colors = {
  greenOne: "#25a75c",
  greenTwo: "#5cb23a",
  greenLight: "rgba(92, 178, 58, 0.17);",
  textOne: "#22202d",
  textTwo: "#333",
  textThree: "#4f4f4f",
  textFour: "#929292",
  textFive: "#8d8d8d",
  textSix: "#424543",
  greyOne: "#757D8A",
  redOne: "#E32648",
  redTwo: "rgba(222, 0, 40, 0.65)",
  redLight: "#F8CCD4",
};

const components = {
  Text: {
    baseStyle: {
      fontFamily: "poppins",
      fontWeight: "400",
      fontSize: "1rem",
    },
  },
  
  Heading: {
    baseStyle: {
      fontFamily: "poppins",
    },
  },
};

const theme = extendTheme({
  colors,
  fonts,
  components,
  config,
  styles: {
    global: {
      body: {
        fontFamily: "poppins",
      },
    },
  },
});

export default theme;
