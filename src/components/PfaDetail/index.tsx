import { Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { string } from 'yup';

type Props = {
  left: string;
  right: any;
  upper?: boolean;
};

const parseLeft = (val: string) => val.replaceAll('_', ' ');

const PfaDetail = ({ left, right, upper }: Props) => {
  if(left === 'wallet_id') {
    console.log('right val: ', right)
  }

  return left === 'token' || typeof left === 'object' ? (
    <></>
  ) : (
    <Flex
      align='center'
      justify='space-between'
      bg='#f1f1f1'
      borderRadius='12px'
      px='6'
      py='4'
      w='full'
    >
      <Text
        color='textFour'
        fontWeight='500'
        fontSize={['0.75rem', '1rem']}
        textTransform='capitalize'
      >
        {parseLeft(left)}
      </Text>

      <Text
        color='#424543'
        fontWeight='500'
        fontSize={['0.75rem', '1rem']}
        textTransform={upper ? 'uppercase' : 'capitalize'}
      >
        {!right
          ? 'N/A'
          : typeof right === 'boolean'
          ? `${right}`
          : typeof right === 'string'
          ? right
          : 'toh'}
        {/* {right ?? "N/A"} */}
      </Text>
    </Flex>
  );
};

export default PfaDetail;
