import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppSelector } from "./reduxHooks";

const useFinanceCheck = (val: boolean | undefined) => {
  const router = useRouter();

  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (!val) return;

    if (user?.account_type === "individual" && user?.roles[0] !== "finance") {
      router.push("/");
      return;
    }
  }, [user]);

  return;
};

export default useFinanceCheck;
