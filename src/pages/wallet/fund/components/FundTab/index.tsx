import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { IFundTab } from '../../index.page';

type Props = {
  tabData: IFundTab[];
};

const FundTab = ({ tabData }: Props) => {
  const router = useRouter();
  return (
    <Tabs
      variant='unstyled'
      isLazy
      defaultIndex={
        router.query?.tab
          ? tabData.findIndex(
              (tab) => tab.label.toLowerCase() === router.query.tab
            )
          : 0
      }
    >
      <TabList gap={[0, 4, 8]} px='4'>
        {tabData.map((tab, index) => (
          <Tab
            key={index}
            color='greenTwo'
            fontSize={['1rem', null, '1.125rem']}
            _selected={{
              color: 'white',
              fontWeight: '700',
              bg: 'greenTwo',
              borderRadius: '50px',
            }}
          >
            {tab.pageTitle}
          </Tab>
        ))}
      </TabList>

      <TabPanels mt={[4]}>
        {tabData.map((tab, index) => (
          <TabPanel p={4} key={index}>
            {tab.content}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

export default FundTab;
