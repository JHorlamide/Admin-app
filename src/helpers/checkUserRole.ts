import { IUser } from "@/types/user";

const checkUserRole = (user: IUser | undefined) => {
  if (!user || user.account_type !== "individual" || !user.company_id) return;

  if (user.roles?.includes("approver")) return "approver";
  if (user.roles?.includes("initiator")) return "initiator";
  if (user.roles?.includes("finance")) return "finance";

  return;
};


export default checkUserRole;
