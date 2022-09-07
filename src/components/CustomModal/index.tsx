import React, { useState } from 'react';
import {
  Box,
  Modal,
  ModalContent,
  ModalOverlay,
  VStack,
  Heading,
  Select,
} from '@chakra-ui/react';
import CustomBtn from '@/components/CustomBtn';
import CustomInput from '@/components/CustomInput';

interface IRoleOption {
  label: string;
  value: string;
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  role: string;
  handleSubmit: () => void;
  userRoleOptions: IRoleOption[];
  setRole: (val: any) => void;
};

const CustomModal = ({
  isOpen,
  onClose,
  role,
  handleSubmit,
  userRoleOptions,
  setRole
}: Props) => {
  const isLoadingUserEdit = false;
  const isError = false;

  return (
    <Box>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset='slideInBottom'
      >
        <ModalOverlay />
        <ModalContent
          mx={[4, 0]}
          maxW='490'
          w='full'
          bg='white'
          borderRadius='6px'
          className='appBox'
          px={[4, 6, 8]}
          py={[6, 6, 8]}
        >
          <Heading
            as='h3'
            color='textOne'
            fontWeight='600'
            fontSize={['1.2rem', '1.5rem']}
            textAlign='center'
          >
            Select Role to Remove
          </Heading>

          <form onSubmit={handleSubmit}>
            <VStack mt={[8, 10]} spacing={[4, 6]}>
              <Box w='full'>
                <CustomInput
                  id='role'
                  label='Choose user role'
                  aria-label='Choose role for user'
                  select
                  selectOptions={userRoleOptions}
                  selectProps={{
                    value: role,
                    onChange: (e) => setRole(e.target.value),
                  }}
                  selectPlaceholder='Choose a role'
                />
              </Box>
            </VStack>

            <CustomBtn
              isFullWidth
              mt={[8, 10]}
              disabled={role.length <= 0}
              isLoading={isLoadingUserEdit}
              iserror={isError}
              type='submit'
            >
              Updated Role
            </CustomBtn>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CustomModal;
