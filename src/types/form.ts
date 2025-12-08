export interface FormQuestion {
  id: string;
  text: string;
  type: string;
  options?: string[];
}

export interface FormContactFields {
  [key: string]: {
    required: boolean;
    label: string;
  };
}

export interface FormSchema {
  title: string;
  description?: string;
  questions: FormQuestion[];
  contactFields?: FormContactFields;
  submissionTitle?: string;
  submissionDescription?: string;
  completionTitle?: string;
  completionDescription?: string;
}

export interface Form {
  id: string;
  supplierId: string;
  formKey: string;
  version: number;
  schema: FormSchema;
  createdAt: string;
  updatedAt: string;
}

