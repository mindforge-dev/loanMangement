import { z } from "zod";
import {
  CreateBorrowerSchema,
  UpdateBorrowerSchema,
} from "./borrowers.validators";

export type CreateBorrowerDTO = z.infer<typeof CreateBorrowerSchema>["body"];
export type UpdateBorrowerDTO = z.infer<typeof UpdateBorrowerSchema>["body"];
