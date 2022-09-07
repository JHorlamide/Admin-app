import * as Yup from "yup";

export const remitPensionSchema = Yup.object({
  description: Yup.string().trim().required("Name of task is required"),
});
