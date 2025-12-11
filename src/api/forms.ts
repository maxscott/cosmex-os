import * as api from "@/api/methods";
import type { Form, FormSchema } from "@/types/form";

export const getForms = async (): Promise<Form[]> => {
  const data = await api.get({ endpoint: "/forms" });

  if (!Array.isArray(data)) {
    throw new Error("Invalid response: expected array of forms");
  }

  return data as Form[];
};

export const getForm = async (formId: string): Promise<Form> => {
  const data = await api.get({ endpoint: `/forms/${formId}` });

  if (!data || typeof data !== "object") {
    throw new Error("Invalid response: expected form object");
  }

  return data as Form;
};

export const createForm = async (
  supplierId: string,
  schema: FormSchema
): Promise<Form> => {
  const data = await api.post({
    endpoint: "/forms",
    body: {
      supplier_id: supplierId,
      schema: JSON.stringify(schema),
    },
  });

  return data as Form;
};

export const updateForm = async (
  formId: string,
  schema: FormSchema
): Promise<Form> => {
  const data = await api.put({
    endpoint: `/forms/${formId}`,
    body: {
      schema: JSON.stringify(schema),
    },
  });

  return data as Form;
};

