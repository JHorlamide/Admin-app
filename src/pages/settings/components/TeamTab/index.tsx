import CustomBtn from "@/components/CustomBtn";
import CustomInput from "@/components/CustomInput";
import CustomTable from "@/components/CustomTable";
import {
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { FormEvent, useMemo, useState } from "react";
import { Column } from "react-table";
import {
  useAddUserToTeamMutation,
  useGetLinkedUsersQuery,
  useDeleteUserMutation,
  useEditUserMutation,
} from "@/redux/api/settingsApiSlice";
import { customAlphabet } from "nanoid";
import toast from "react-hot-toast";
import { IUser } from "@/types/user";
import capitalize from "src/helpers/capitalize";
import AppLoader from "@/components/AppLoader";
const nanoid = customAlphabet("1234567890abcdef", 8);

const userRoleOptions = [
  { label: "Initiator", value: "initiator" },
  { label: "Approver", value: "approver" },
  { label: "Finance", value: "finance" },
];

interface EditUserData {
  email: string;
  roles: string[];
  _id: string;
}

const TeamTab = () => {
  const teamColumns: Column<IUser>[] = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ row: { original } }) => (
          <>{`${capitalize(original?.first_name) || "---"} ${
            capitalize(original?.last_name) || "---"
          }`}</>
        ),
      },
      { Header: "Email", accessor: "email" },
      {
        Header: "Role",
        accessor: "roles",
        Cell: ({ value }) => <>{value ? capitalize(value[0]) : ""}</>,
      },
      {
        Header: "Actions",
        accessor: "_id",
        Cell: ({ row: { original } }) => (
          <Flex gap='4'>
            <Button
              color='greenTwo'
              fontWeight='600'
              borderRadius='50'
              fontSize='14px'
              py='0'
              px='8'
              bg='greenLight'
              transition='all .2s ease-in-out'
              _hover={{
                transform: "scale(1.03)",
              }}
              onClick={() => editUserRoleModal(original)}
            >
              Edit
            </Button>

            <Button
              color='rgba(222, 0, 40, 0.65)'
              fontWeight='600'
              borderRadius='50'
              fontSize='14px'
              py='0'
              px='8'
              bg='rgba(222, 0, 40, 0.2)'
              transition='all .2s ease-in-out'
              _hover={{
                transform: "scale(1.03)",
              }}
              onClick={() => removeUser(original._id)}
            >
              Delete
            </Button>
          </Flex>
        ),
      },
    ],
    []
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();

  const { data: teamData, isLoading: isLoadingTeam } = useGetLinkedUsersQuery();
  const [addUser, { isLoading, isError }] = useAddUserToTeamMutation();

  const [deleteUser, { isLoading: isLoadingDelete, isError: isErrorDelete }] =
    useDeleteUserMutation();

  const [editUserData, { isLoading: isLoadingEdit, isError: isErrorEdit }] =
    useEditUserMutation();

  const [role, setRole] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [editData, setEditData] = useState<EditUserData>({
    email: "",
    roles: [""],
    _id: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await addUser({
        email,
        // password: nanoid(),
        password: "123456",
        roles: [role],
      }).unwrap();

      toast.success(res?.message);

      onClose();

      setEmail("");
      setRole("");
    } catch (error) {}
  };

  const removeUser = async (value: any) => {
    try {
      const res = await deleteUser({
        user_id: value,
      }).unwrap();

      toast.success(res?.message);

      onClose();

      setEmail("");
      setRole("");
    } catch (error) {}
  };

  const editUserRoleModal = async ({ email, roles, _id }: any) => {
    onOpenEdit();
    setEditData({ email, roles, _id });
  };

  const editUserRole = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await editUserData({
        roles: [role],
        _id: editData._id,
      }).unwrap();

      toast.success(response?.message);

      onCloseEdit();
    } catch (error) {
      console.log("Error", error);
    }
  };

  const teamDataArr = teamData ? Object.values(teamData.data) : [];

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
            fontSize={["1.2rem", "1.5rem"]}
            textAlign='center'
          >
            Invite Someone
          </Heading>

          <form onSubmit={handleSubmit}>
            <VStack mt={[8, 10]} spacing={[4, 6]}>
              <CustomInput
                label='Email address'
                id='email'
                inputProps={{
                  placeholder: "Ex. josh@mail.com",
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  type: "email",
                }}
                light
                isRequired
              />
              <Box w='full'>
                {/* <Text color="#171717" fontSize=".875rem" fontWeight="500" mb="1">
                  Choose user roles
                </Text> */}
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
              disabled={email.length <= 0 || role.length <= 0}
              isLoading={isLoading}
              iserror={isError}
              type='submit'
            >
              Send Request
            </CustomBtn>
          </form>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
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
            fontSize={["1.2rem", "1.5rem"]}
            textAlign='center'
          >
            Edit User Role
          </Heading>

          <form onSubmit={editUserRole}>
            <VStack mt={[8, 10]} spacing={[4, 6]}>
              <CustomInput
                label='Email address'
                id='email'
                inputProps={{
                  placeholder: "Ex. josh@mail.com",
                  value: editData.email,
                  onChange: (e) => setEmail(e.target.value),
                  type: "email",
                }}
                light
                isRequired
              />
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
              disabled={editData.email.length <= 0 || role.length <= 0}
              isLoading={isLoadingEdit}
              iserror={isErrorEdit}
              type='submit'
            >
              Update
            </CustomBtn>
          </form>
        </ModalContent>
      </Modal>

      <Flex justify='flex-end'>
        <CustomBtn onClick={onOpen}>Invite someone</CustomBtn>
      </Flex>

      <Box mt={[4, 6]} className='profileBox' pb='4'>
        {isLoadingTeam ? (
          <AppLoader />
        ) : (
          <CustomTable data={teamDataArr} columns={teamColumns} />
        )}
      </Box>
    </Box>
  );
};

export default TeamTab;
