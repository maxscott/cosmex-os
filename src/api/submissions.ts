import * as api from "@/api/methods";
import type { Submission } from "@/types/submission";

interface SubmissionsResponse {
  submissions: Submission[];
  total: number;
  page: number;
  perPage: number;
}

export const getSubmissions = async (
  token: string,
  page: number = 1,
  perPage: number = 50
): Promise<SubmissionsResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });
  const data = await api.get({ endpoint: `/submissions?${params.toString()}`, token });

  if (
    typeof data !== "object" || data === null ||
    !("submissions" in data) ||
    !("total" in data) ||
    !("page" in data) ||
    !("perPage" in data) ||
    !Array.isArray(data.submissions)
  ) {
    throw new Error("Invalid response: expected object with submissions, total, page, and per_page");
  }

  return data as SubmissionsResponse;
};
