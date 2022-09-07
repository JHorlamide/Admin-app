import React, { useMemo } from 'react';
import { Grid, Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { nanoid } from '@reduxjs/toolkit';
import { useGetPfaDetailQuery } from '@/redux/api/pfasApiSlice';
import Layout from '@/components/Layout';
import PfaDetail from '@/components/PfaDetail';
import AppLoader from '@/components/AppLoader';

type StringOrNull = string | null;

export type UserValueType = (boolean | StringOrNull | string[])[];

const PFAPage = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { data, isLoading } = useGetPfaDetailQuery({ _id: id });

  const formattedPfa = useMemo(() => {
    const copied = { ...data?.data };
    const merged = { ...copied };

    return merged;
  }, [data]);

  const pfaKeys: string[] = useMemo(
    () => Object.keys(formattedPfa),
    [formattedPfa]
  );

  const pfaValues = useMemo(
    () => Object.values(formattedPfa), 
    [formattedPfa]
  );

  return (
    <Layout>
      <Box my='4'>
        {isLoading ? (
          <AppLoader />
        ) : (
          <Grid templateColumns={['1fr']} gridGap='4' mt='4'>
            {pfaKeys.map((userItem, index) => (
              <PfaDetail
                key={nanoid()}
                left={userItem}
                right={pfaValues[index] as UserValueType}
              />
            ))}
          </Grid>
        )}
      </Box>
    </Layout>
  );
};

export default PFAPage;
