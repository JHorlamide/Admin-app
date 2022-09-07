import { VStack, Flex, Text, Grid } from '@chakra-ui/react';
import React, { useState } from 'react';
import CustomBtn from '@/components/CustomBtn';
import CustomInput from '@/components/CustomInput';
import { FormikHelpers, useFormik } from 'formik';
import { paymentLinkSchema } from 'src/validation/wallet.validation';
import styles from './style.module.scss';
import toast from 'react-hot-toast';
import { ILinkItem } from '@/types/paymentLinks';
import { useGeneratePaymentLinkMutation } from '@/redux/api/paymentLinksApiSlice';
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface IFormValues {
  title: string;
  amount: string;
  linkType: string;
  message: string;
}

const PaymentLinkTab = () => {
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [linkData, setLinkData] = useState<ILinkItem>();

  const initialValues: IFormValues = {
    title: '',
    amount: '',
    linkType: '',
    message: '',
  };
  const [generateLink, { isLoading, isError }] =
    useGeneratePaymentLinkMutation();

  const handleCreateLink = async (
    values: IFormValues,
    actions: FormikHelpers<IFormValues>
  ) => {
    try {
      const res = await generateLink({
        title: values.title,
        description: values.message,
        amount: values.amount,
        is_recurring: values.linkType === 'single' ? false : true,
      }).unwrap();

      toast.success('Payment link created successfully!');

      setLinkData(res?.data?.link);
      setIsCompleted(true);
      actions.resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: paymentLinkSchema,
      onSubmit: handleCreateLink,
    });

  const setDone = () => {
    setLinkData(undefined);
    setIsCompleted(false);
  };

  const generatedLink = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/payment-link/${linkData?.payment_link_reference}`;

  return (
    <Flex justifyContent={'center'}>
      <VStack
        w='500px'
        bg='white'
        borderRadius='6px'
        className={styles.container}
        px={[4, 6, 8]}
        py={[6, 6, 8]}
      >
        {isCompleted && linkData ? (
          <>
            <CopyToClipboard
              text={generatedLink}
              onCopy={() => toast.success('Link copied')}
            >
              <Text
                color='textFour'
                fontWeight='500'
                textAlign='center'
                cursor='pointer'
              >
                CLICK TO COPY LINK
              </Text>
            </CopyToClipboard>

            <Text
              mt='2'
              color='black'
              fontWeight='600'
              fontSize={['1.25rem']}
              textAlign='center'
            >
              {generatedLink}
            </Text>

            <VStack mt={[6, 8]} spacing={4} w='full'>
              <Flex
                justify='space-between'
                bg='#f1f1f1'
                borderRadius='12px'
                px={[5, 6]}
                py={[4]}
                w='full'
              >
                <Text
                  color='textFour'
                  fontWeight='500'
                  fontSize={['0.8rem', '1rem']}
                >
                  Title
                </Text>
                <Text
                  color='textSix'
                  fontWeight='500'
                  fontSize={['0.8rem', '1rem']}
                >
                  {linkData.title}
                </Text>
              </Flex>
              <Flex
                justify='space-between'
                bg='#f1f1f1'
                borderRadius='12px'
                px={[5, 6]}
                py={[4]}
                w='full'
              >
                <Text
                  color='textFour'
                  fontWeight='500'
                  fontSize={['0.8rem', '1rem']}
                >
                  Amount
                </Text>
                <Text
                  color='textSix'
                  fontWeight='500'
                  fontSize={['0.8rem', '1rem']}
                >
                  {linkData.amount}
                </Text>
              </Flex>
              <Flex
                justify='space-between'
                bg='#f1f1f1'
                borderRadius='12px'
                px={[5, 6]}
                py={[4]}
                w='full'
              >
                <Text
                  color='textFour'
                  fontWeight='500'
                  fontSize={['0.8rem', '1rem']}
                >
                  Type
                </Text>
                <Text
                  color='textSix'
                  fontWeight='500'
                  fontSize={['0.8rem', '1rem']}
                >
                  {linkData.is_recurring ? 'Recurring use' : 'Single use'}
                </Text>
              </Flex>
            </VStack>

            <CustomBtn light isFullWidth mt={['6']} onClick={setDone}>
              Okay
            </CustomBtn>
          </>
        ) : (
          <form style={{ width: '100%' }} onSubmit={handleSubmit}>
            <VStack align='flex-start' w='full' spacing={6}>
              <CustomInput
                id='title'
                label='Title'
                inputProps={{
                  placeholder: '.e.g Get cash',
                  value: values.title,
                  onChange: handleChange,
                  onBlur: handleBlur('title'),
                  isInvalid: errors.title && touched.title ? true : false,
                }}
                errorText={errors.title && touched.title ? errors.title : null}
              />
              <CustomInput
                id='linkType'
                label='Link type'
                selectPlaceholder='Choose a link type'
                selectProps={{
                  value: values.linkType,
                  onChange: handleChange,
                  onBlur: handleBlur('linkType'),
                  isInvalid: errors.linkType && touched.linkType ? true : false,
                }}
                errorText={
                  errors.linkType && touched.linkType ? errors.linkType : null
                }
                selectOptions={[
                  { label: 'Single use', value: 'single' },
                  { label: 'Recurring use', value: 'recurring' },
                ]}
                select
              />
              <CustomInput
                id='amount'
                label='Amount'
                inputProps={{
                  placeholder: '.e.g 5000',
                  value: values.amount,
                  onChange: handleChange,
                  onBlur: handleBlur('amount'),
                  isInvalid: errors.amount && touched.amount ? true : false,
                  type: 'number',
                }}
                errorText={
                  errors.amount && touched.amount ? errors.amount : null
                }
              />
              <CustomInput
                id='message'
                label='Message (optional)'
                boxProps={{
                  placeholder: '.e.g 10,000',
                  value: values.message,
                  onChange: handleChange,
                  onBlur: handleBlur('message'),
                  isInvalid: errors.message && touched.message ? true : false,
                }}
                box
                errorText={
                  errors.message && touched.message ? errors.message : null
                }
              />

              <Grid templateColumns={['1fr', '1fr 1fr']} gap={[4, 6]} w='full'>
                <CustomBtn light>Cancel</CustomBtn>
                <CustomBtn
                  type='submit'
                  isLoading={isLoading}
                  iserror={isError}
                >
                  Create link
                </CustomBtn>
              </Grid>
            </VStack>
          </form>
        )}
      </VStack>
    </Flex>
  );
};

export default PaymentLinkTab;
