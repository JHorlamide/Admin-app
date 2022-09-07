import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAppSelector } from "./reduxHooks";

const useNewUserCheck = () => {
  const router = useRouter();
  const [test, setTest] = useState<boolean>(false);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (
      user?.account_type === "individual" &&
      user?.company_id &&
      !user?.phone
    ) {
      setTest((prevState) => !prevState);
      router.push("/complete-profile/business-individual");
      
      return;
    }

    if (
      user?.account_type === "individual" &&
      !user?.company_id &&
      !user?.phone
    ) {
      setTest((prevState) => !prevState);
      router.push("/complete-profile/individual");

      return;
    }

    if (user && user?.account_type !== "individual" && !user?.rc_number) {
      setTest((prevState) => !prevState);
      router.push("/complete-profile/business");
      return;
    }
  }, [user]);
  
  return test;
};

export default useNewUserCheck;
