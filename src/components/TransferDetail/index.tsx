import { Flex, Text } from '@chakra-ui/react';

type Props = {
  left: string;
  right: string | number;
  upper?: boolean;
  initial?: boolean;
};

const TransferDetail = ({ left, right, upper, initial }: Props) => {
  return (
    <Flex
      align='center'
      justify='space-between'
      bg='#f1f1f1'
      borderRadius='12px'
      px='6'
      py='4'
      w='full'
      gap={[8, 16]}
    >
      <Text
        color='textFour'
        fontWeight='500'
        fontSize={['0.75rem', '1rem']}
        textTransform='capitalize'
      >
        {left}
      </Text>
      <Text
        color='#424543'
        fontWeight='500'
        fontSize={['0.75rem', '1rem']}
        textTransform={upper ? 'uppercase' : initial ? 'initial' : 'capitalize'}
        wordBreak='break-word'
        textAlign='right'
      >
        {typeof right === 'number' ? right.toFixed(2) : right}
      </Text>
    </Flex>
  );
};

export default TransferDetail;
