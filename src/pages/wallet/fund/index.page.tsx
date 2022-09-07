import { Box } from '@chakra-ui/react';
import Layout from '@/components/Layout';
import Script from "next/script";
import { ReactNode } from 'react';
import toast from "react-hot-toast";
import FundWalletTab from './components/FundWalletTab';
import PaymentLinkTab from './components/PaymentLinkTab';
import FundTab from './components/FundTab';
import { NextPage } from 'next';


export interface IFundTab {
  label: string;
  pageTitle: string;
  content: ReactNode;
}

const tabData: IFundTab[] = [
  {
    label: 'Fund Wallet',
    pageTitle: 'Fund Wallet',
    content: <FundWalletTab />,
  },
  {
    label: 'Create payment link',
    pageTitle: 'Create payment link',
    content: <PaymentLinkTab />,
  },
];

const FundWallet: NextPage = () => {
  const showMonnifyError = (e: any) => {
    console.log(e);
    toast.error("Payment service integration failed");
  };

  return (
    <Layout>
      <Script
        strategy="afterInteractive"
        src="https://sdk.monnify.com/plugin/monnify.js"
        onError={(e) => showMonnifyError(e)}
      />

      <Box>
        <FundTab tabData={tabData} />
      </Box>
    </Layout>
  );
};

export default FundWallet;
