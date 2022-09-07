import { useRouter } from "next/router";
import { useEffect } from "react";
import checkUserRole from "src/helpers/checkUserRole";
import checkUserType from "src/helpers/checkUserType";
import { useAppSelector } from "@/hooks/reduxHooks";

export type UserPermissions =
  | "business"
  | "individual"
  | "finance"
  | "approver"
  | "initiator"
  | "all"
  | "business-individual"
  | undefined;

const useBusinessCheck = (val: UserPermissions[] | undefined) => {
  const router = useRouter();
  const user = useAppSelector((state: any) => state.auth.user);

  const userRole = checkUserRole(user);
  const userType = checkUserType(user);

  useEffect(() => {
    if (!val || !userRole || !userType) return;

    if (val.includes("all")) return;

    if (val.includes(userRole) || val.includes(userType)) {
      return;
    } else {
      router.push("/");
    }
  }, [user, val, userRole, userType]);

  return;
};

export default useBusinessCheck;
