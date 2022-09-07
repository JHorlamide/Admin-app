import {
  Center,
  Heading,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { useCallback, useState } from 'react';
import { UploadPlusIcon } from '@/components/UploadIcon';
import CustomBtn from '../CustomBtn';

type Props = {
  file: File | undefined;
  selectFile: (val: File | undefined) => void;
  isOpen: boolean;
  onClose: () => void;
  fileType?: string | string[];
  title?: string;
};

const FileUpload = ({
  selectFile,
  file,
  isOpen,
  onClose,
  fileType = ['.png', 'jpg', 'jpeg'],
  title = 'Choose an image to upload',
}: Props) => {
  const [localFile, setLocalFile] = useState<File | undefined>();

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any) => {
    if (fileRejections.length > 0) {
      setLocalFile(undefined);
      return;
    };

    setLocalFile(acceptedFiles[0]);
  }, []);

  const closeModal = () => {
    setLocalFile(undefined);
    onClose();
  };

  const closeModalDone = () => {
    selectFile(localFile);
    closeModal();
  };

  const { getRootProps, getInputProps, fileRejections, acceptedFiles } =
    useDropzone({
      onDrop,
      accept: fileType,
      maxFiles: 1,
    });

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
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
          {title}
        </Heading>

        <Center
          bg='#E3F2DE'
          my={[6, 8, 10]}
          w={['180px', '240px']}
          h={['180px', '240px']}
          mx='auto'
          cursor='pointer'
          flexDirection='column'
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <UploadPlusIcon fontSize={['3.5rem', '4.5rem']} />
          {localFile ? (
            <Text
              fontSize={['0.75rem', '0.875rem']}
              color='green.500'
              mt='4'
              mx='2'
              fontWeight='600'
              textAlign='center'
            >
              {localFile.name}
            </Text>
          ) : file ? (
            <Text
              fontSize={['0.75rem', '0.875rem']}
              color='green.500'
              mt='4'
              mx='2'
              fontWeight='600'
              textAlign='center'
            >
              {file.name}
            </Text>
          ) : (
            <></>
          )}
        </Center>

        {fileRejections.length > 0 ? (
          <Text
            fontSize={['0.75rem', '0.875rem']}
            color='red.500'
            mb='4'
            textAlign='center'
            fontWeight='500'
          >
            {fileRejections[0].errors[0].message}
          </Text>
        ) : (
          <></>
        )}

        <CustomBtn isFullWidth onClick={closeModalDone}>
          Done
        </CustomBtn>
      </ModalContent>
    </Modal>
  );
};

export default FileUpload;
