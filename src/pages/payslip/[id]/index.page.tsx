import AppLoader from "@/components/AppLoader";
import Layout from "@/components/Layout";
import CustomTable from "@/components/CustomTable";
import { useGetSinglePayslipQuery } from "@/redux/api/payslipsApiSlice";
import { ISlip } from "@/types/payslips";
import {
  Box,
  Center,
  Container,
  Flex,
  Heading,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import numeral from "numeral";
import { useMemo, useState } from "react";
import { Column } from "react-table";
import SlipModal from "../components/SlipModal";

export const slipsColumns: Column<ISlip>[] = [
  { Header: "Name", accessor: "employee_name" },
  { Header: "Employer", accessor: "employer" },
  { Header: "Designation", accessor: "employee_designation" },
  { Header: "Total Gross", accessor: "total_gross" },
  { Header: "Total Net", accessor: "total_net" },
  { Header: "Taxable income", accessor: "taxable_income" },
  { Header: "Days worked", accessor: "days_worked" },
];

const SinglePayslip: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [selectedSlip, setSelectedSlip] = useState<ISlip | undefined>();

  const { data, isLoading } = useGetSinglePayslipQuery(id as string, { skip: !id });

  const columns = useMemo(() => slipsColumns, []);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const selectSlip = (slip: any) => {
    setSelectedSlip(slip);
    onOpen();
  };

  const totalGross = useMemo(() => {
    const res = data?.data?.slips.slips
      .map((slip) => Number(slip.total_gross))
      .reduce((a, b) => a + b, 0);
    return res;
  }, [data]);

  const totalNet = useMemo(() => {
    const res = data?.data?.slips.slips
      .map((slip) => Number(slip.total_net))
      .reduce((a, b) => a + b, 0);
    return res;
  }, [data]);

  const totalTaxIncome = useMemo(() => {
    const res = data?.data?.slips.slips
      .map((slip) => Number(slip.taxable_income))
      .reduce((a, b) => a + b, 0);
    return res;
  }, [data]);

  return (
    <Layout>
      <SlipModal onClose={onClose} isOpen={isOpen} slip={selectedSlip} />
      <Container maxW="1100" py={[8, 10]}>
        <Heading as="h2" color="#0f0919" fontWeight="600" fontSize={["1.5rem", "2rem"]}>
          Payslip #{id}
        </Heading>
        {isLoading ? (
          <Center w="full" h="full" minH="500" flex="1">
            <Spinner size="xl" color="greenOne" />
          </Center>
        ) : (
          <>
            <Flex
              mt={[8, 6]}
              w="full"
              justify="space-between"
              align={["flex-start", "center"]}
              borderRadius={8}
              bg="rgba(245, 245, 245, 0.7)"
              py="3"
              px="5"
              wrap="wrap"
              direction={["column", "row"]}
              gap={[4, 0]}
            >
              <Flex
                flexDirection={["row", "column"]}
                gap={[6, 3]}
                justify={["space-between", "initial"]}
                w={["full", "auto"]}
              >
                <Text color="greenOne" fontWeight="600">
                  TOTAL NUMBER OF EMPLOYEES
                </Text>
                <Text color="#757575" fontWeight="500" mt={["0", "3"]} textAlign="center">
                  {data?.data?.slips?.count}
                </Text>
              </Flex>
              <Flex
                flexDirection={["row", "column"]}
                gap={[6, 3]}
                justify={["space-between", "initial"]}
                w={["full", "auto"]}
              >
                <Text color="greenOne" fontWeight="600">
                  TOTAL NET SALARY
                </Text>
                <Text color="#757575" fontWeight="500" mt={["0", "3"]} textAlign="center">
                  ₦{numeral(totalNet).format("0,0.00")}
                </Text>
              </Flex>
              <Flex
                flexDirection={["row", "column"]}
                gap={[6, 3]}
                justify={["space-between", "initial"]}
                w={["full", "auto"]}
              >
                <Text color="greenOne" fontWeight="600">
                  TOTAL GROSS SALARY
                </Text>
                <Text color="#757575" fontWeight="500" mt={["0", "3"]} textAlign="center">
                  ₦{numeral(totalGross).format("0,0.00")}
                </Text>
              </Flex>
              <Flex
                flexDirection={["row", "column"]}
                gap={[6, 3]}
                justify={["space-between", "initial"]}
                w={["full", "auto"]}
              >
                <Text color="greenOne" fontWeight="600">
                  TOTAL INCOME TAX
                </Text>
                <Text color="#757575" fontWeight="500" mt={["0", "3"]} textAlign="center">
                  ₦{numeral(totalTaxIncome).format("0,0.00")}
                </Text>
              </Flex>
            </Flex>
            <Box mt={[6]}>
              <CustomTable
                data={data?.data.slips.slips ?? []}
                columns={columns}
                rowClickAction={(val) => selectSlip(val)}
              />
            </Box>
          </>
        )}
      </Container>
    </Layout>
  );
};

export default SinglePayslip;
