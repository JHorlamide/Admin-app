import {
  Box,
  Stat,
  Flex,
  Text,
  Spinner,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  stat: string;
  icon: ReactNode;
  text?: string;
  select?: () => void;
  hover?: string;
  isloading?: boolean;
}

const Loading = () => {
  return <Spinner size='sm' />;
};

const StatsCard = (props: StatsCardProps) => {
  const { title, stat, icon, text, select, hover, isloading } = props;

  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={'5'}
      shadow={'xl'}
      border={'1px solid'}
      borderColor={useColorModeValue('gray.800', 'gray.500')}
      rounded={'lg'}
    >
      <Flex
        justifyContent={'space-between'}
        _hover={{ cursor: hover }}
        onClick={select}
      >
        <Box pl={{ base: 2, md: 4 }}>
          <StatLabel fontWeight={'medium'} isTruncated>
            {title}
          </StatLabel>

          <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
            <Text
              as='span'
              fontSize={['1rem']}
              verticalAlign='top'
              fontWeight='600'
              color='black'
              position='relative'
              top={2}
              right={1}
            >
              {text}
            </Text>
            {isloading ? <Loading /> : stat}
          </StatNumber>
        </Box>

        <Box
          my={'auto'}
          color={useColorModeValue('gray.800', 'gray.200')}
          alignContent={'center'}
        >
          {icon}
        </Box>
      </Flex>
    </Stat>
  );
};

export default StatsCard;
