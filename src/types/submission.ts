export interface Submission {
  id: string;
  formId: string;
  supplierId: string;
  answers: Record<string, unknown>;
  contact: Record<string, unknown>;
  submittedAt: string;
  requestIp?: string;
  userAgent?: string;
  referer?: string;
  origin?: string;
  widgetVersion?: string;
  createdAt: string;
  updatedAt: string;
}

