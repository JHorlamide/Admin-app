import { IUser } from "@/types/user";

const checkUserType = (user: IUser | undefined) => {
  if (!user) return;

  if (user.account_type === "individual" && !user.company_id) return "individual";

  if (user.account_type === "individual" && user.company_id) return "business-individual";

  return "business";
};

export default checkUserType;
