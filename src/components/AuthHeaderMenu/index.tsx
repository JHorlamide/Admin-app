import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Circle,
  Flex,
  Icon,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  VStack,
} from "@chakra-ui/react";
import { logoutUser } from "@/redux/authSlice";
import { useRouter } from "next/router";
import { taxitPayApi } from "@/redux/apiSlice";
import { MdLogout } from "react-icons/md";
import { AiOutlineUser, AiOutlineTeam } from "react-icons/ai";
import { IoOptionsOutline, IoChatboxEllipsesOutline } from "react-icons/io5";

type Props = {
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
};

type PopoverTrigger = {
  children: React.ReactNode; // 👈️ type children
};

const AuthHeaderMenu = ({ isOpen, openMenu, closeMenu }: Props) => {
  const user = useAppSelector((state) => state.auth.user);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const logout = () => {
    try {
      taxitPayApi.util.invalidateTags(["Profile"]);
      dispatch(logoutUser());
      router.replace("/");
    } catch (error) {}
  };

  // const userName = user?.entity_name || user?.name;
  const userName = user?.account_type === "individual" ? user?.name : user?.entity_name;
  const initials = userName
    ?.split(" ")
    .map((word: string) => word.charAt(0))
    .join("");

  const individualMenuOptions = [
    {
      title: "Profile",
      action: () => router.push("/settings?tab=profile", "/settings"),
      color: "greyOne",
      icon: AiOutlineUser,
    },
    { title: "Logout", action: logout, color: "redOne", icon: MdLogout },
  ];

  const businessMenuOptions = [
    {
      title: "Profile",
      action: () => router.push("/settings?tab=profile", "/settings"),
      color: "greyOne",
      icon: AiOutlineUser,
    },
    {
      title: "Team",
      action: () => router.push("/settings?tab=team", "/settings"),
      color: "greyOne",
      icon: AiOutlineTeam,
    },
    {
      title: "Preferences",
      action: () => router.push("/settings?tab=preferences", "/settings"),
      color: "greyOne",
      icon: IoOptionsOutline,
    },
    {
      title: "Support",
      action: () => router.push("/settings?tab=support", "/settings"),
      color: "greyOne",
      icon: IoChatboxEllipsesOutline,
    },
    { title: "Logout", action: logout, color: "redOne", icon: MdLogout },
  ];

  return (
    <Popover isOpen={isOpen} onClose={closeMenu}>
      {/* <PopoverTrigger> */}
        <Flex
          display={["none", null, null, "flex"]}
          p="2"
          bg="#ddfae7"
          align="center"
          borderRadius="50"
          cursor="pointer"
          className="appHover"
          onClick={openMenu}
        >
          <Circle size="31px" bg="greenTwo">
            <Text color="white" fontSize="16px" fontWeight="500">
              {userName[0].toUpperCase()}
            </Text>
          </Circle>

          <Text ml="3" mr="4" color="textThree" fontSize="14px" whiteSpace="nowrap">
            Hi, {user?.entity_name ?? user?.first_name ?? ""}
          </Text>
          <ChevronDownIcon color="textFour" />
        </Flex>
      {/* </PopoverTrigger> */}
      <PopoverContent w="150px">
        <PopoverBody px="0">
          {user?.account_type === "individual" ? (
            <VStack>
              {individualMenuOptions.map((item) => (
                <Button
                  isFullWidth
                  bg="transparent"
                  color={item.color}
                  justifyContent="flex-start"
                  fontSize="15px"
                  onClick={item.action}
                  key={item.title}
                >
                  <Icon as={item.icon} color={item.color} mr="2" /> {item.title}
                </Button>
              ))}
            </VStack>
          ) : (
            <VStack>
              {businessMenuOptions.map((item) => (
                <Button
                  isFullWidth
                  bg="transparent"
                  color={item.color}
                  justifyContent="flex-start"
                  fontSize="15px"
                  onClick={item.action}
                  key={item.title}
                >
                  <Icon as={item.icon} color={item.color} mr="2" /> {item.title}
                </Button>
              ))}
            </VStack>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default AuthHeaderMenu;
