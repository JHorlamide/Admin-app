import {
  FormControl,
  FormLabel,
  Input,
  InputProps,
  Select,
  SelectProps,
  FormControlProps,
  Text,
  Spinner,
  Textarea,
  TextareaProps,
} from "@chakra-ui/react";

type SelectOptionType = {
  label?: string;
  value?: string;
  name?: string;
};

interface CustomInputProps extends FormControlProps {
  inputProps?: InputProps;
  label: string;
  id: string;
  select?: boolean;
  selectOptions?: SelectOptionType[];
  selectProps?: SelectProps;
  errorText?: string | undefined | null;
  selectLoading?: boolean;
  selectPlaceholder?: string;
  light?: boolean;
  box?: boolean;
  boxProps?: TextareaProps;
}

const CustomInput = ({
  inputProps,
  label,
  id,
  select,
  selectOptions,
  selectProps,
  errorText,
  selectLoading,
  selectPlaceholder,
  light,
  box,
  boxProps,
  ...rest
}: CustomInputProps) => {
  return (
    <FormControl {...rest}>
      <FormLabel
        htmlFor={id}
        color="#171717"
        fontSize=".875rem"
        fontWeight="500"
        fontFamily="poppins"
        requiredIndicator={<></>}
      >
        {label}
      </FormLabel>
      {select ? (
        <Select
          border={light ? "1px solid #DBE2EA" : "none"}
          borderRadius="8px"
          color="textOne"
          w="full"
          fontSize="0.875rem"
          size="lg"
          fontFamily="poppins"
          id={id}
          bg={light ? "transparent" : "#EFF0F6"}
          {...selectProps}
          defaultValue=""
        >
          {selectPlaceholder ? (
            <option value="" disabled>
              {selectPlaceholder}
            </option>
          ) : null}
          {selectLoading ? (
            <option disabled>
              <Spinner />
            </option>
          ) : (
            selectOptions?.map((option) => (
              <option
                value={option.value || option.name}
                key={`${option.value || option.name}${Math.random()}`}
              >
                {option.label || option.name}
              </option>
            ))
          )}
        </Select>
      ) : box ? (
        <Textarea
          border={light ? "1px solid #DBE2EA" : "none"}
          borderRadius="8px"
          px="4"
          color="textOne"
          w="full"
          fontSize="0.875rem"
          size="lg"
          fontFamily="poppins"
          id={id}
          bg={light ? "transparent" : "#EFF0F6"}
          resize="none"
          {...boxProps}
        />
      ) : (
        <Input
          border={light ? "1px solid #DBE2EA" : "none"}
          borderRadius="8px"
          px="4"
          color="textOne"
          w="full"
          fontSize="0.875rem"
          size="lg"
          fontFamily="poppins"
          id={id}
          bg={light ? "transparent" : "#EFF0F6"}
          {...inputProps}
        />
      )}
      {errorText ? (
        <Text color="#E53E3E" mt="1" fontSize={["0.75rem", "0.875rem"]}>
          {errorText}
        </Text>
      ) : null}
    </FormControl>
  );
};

export default CustomInput;
