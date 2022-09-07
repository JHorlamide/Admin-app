import { useAppSelector } from "@/hooks/reduxHooks";
import { Box, Container, Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import { ReactNode } from "react";
import ProfileTab from "./components/ProfileTab";
import SettingsTabs from "./components/SettingsTabs";
import TeamTab from "./components/TeamTab";
import Layout from "@/components/Layout";

export interface ISettingsTab {
  label: string;
  pageTitle: string;
  content: ReactNode;
};

const tabData: ISettingsTab[] = [
  { label: "Profile", pageTitle: "Your Profile", content: <ProfileTab /> },
  { label: "Team", pageTitle: "Team", content: <TeamTab /> },
  { label: "Preferences", pageTitle: "Preferences", content: <></> },
  { label: "Support", pageTitle: "Support", content: <></> },
];

const individualTabData: ISettingsTab[] = [
  { label: "Profile", pageTitle: "Your Profile", content: <ProfileTab /> },
  { label: "Preferences", pageTitle: "Preferences", content: <></> },
  { label: "Support", pageTitle: "Support", content: <></> },
];

const Settings: NextPage = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <Layout>
      <Container maxW='1100'>
        <Heading
          color='#4a4a4a'
          fontWeight='600'
          fontSize={["1.5rem", "1.75rem"]}
          my={[6, 10]}
        >
          Your Settings
        </Heading>

        <SettingsTabs
          tabData={
            user?.account_type === "individual" ? individualTabData : tabData
          }
        />

      </Container>
    </Layout>
  );
};

export default Settings;
