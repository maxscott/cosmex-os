import * as api from "@/api/methods";
import type { Form } from "@/types/form";

export const getForms = async (token: string): Promise<Form[]> => {
  const data = await api.get({ endpoint: "/forms", token });

  if (!Array.isArray(data)) {
    throw new Error("Invalid response: expected array of forms");
  }

  return data as Form[];
};

