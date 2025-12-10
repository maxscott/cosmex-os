import * as api from "@/api/methods";
import type { Form, FormSchema } from "@/types/form";

export const getForms = async (token: string): Promise<Form[]> => {
  const data = await api.get({ endpoint: "/forms", token });

  if (!Array.isArray(data)) {
    throw new Error("Invalid response: expected array of forms");
  }

  return data as Form[];
};

export const getForm = async (token: string, formId: string): Promise<Form> => {
  const data = await api.get({ endpoint: `/forms/${formId}`, token });

  if (!data || typeof data !== "object") {
    throw new Error("Invalid response: expected form object");
  }

  return data as Form;
};

export const createForm = async (
  token: string,
  supplierId: string,
  schema: FormSchema
): Promise<Form> => {
  const data = await api.post({
    endpoint: "/forms",
    body: {
      supplier_id: supplierId,
      schema: JSON.stringify(schema),
    },
    token,
  });

  return data as Form;
};

export const updateForm = async (
  token: string,
  formId: string,
  schema: FormSchema
): Promise<Form> => {
  const data = await api.put({
    endpoint: `/forms/${formId}`,
    body: {
      schema: JSON.stringify(schema),
    },
    token,
  });

  return data as Form;
};

