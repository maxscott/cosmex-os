import { useQuery } from "@tanstack/react-query";
import { getSubmissions } from "@/api/submissions";
import { getForms } from "@/api/forms";
import { useAuth } from "@/contexts/useAuth";
import type { Submission } from "@/types/submission";
import type { Form } from "@/types/form";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GroupedSubmission {
  form: Form;
  submissions: Submission[];
}

const SubmissionTable = ({ form, submissions }: GroupedSubmission) => {
  const questions = form.schema.questions || [];

  // Get all unique question IDs from submissions
  const questionColumns = questions.map((q) => q.id);

  // Format answer value for display
  const formatAnswer = (value: unknown): string => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{form.schema.title}</h3>
        <p className="text-sm text-gray-500">
          Form Key: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{form.formKey}</code>
          {" · "}
          {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 border-r border-gray-200">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-[120px] bg-gray-50 z-10 border-r border-gray-200">
                Email
              </th>
              {questionColumns.map((questionId) => {
                const question = questions.find((q) => q.id === questionId);
                return (
                  <th
                    key={questionId}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {question?.text || questionId}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {submissions.map((submission) => (
              <tr key={submission.id} className="hover:bg-gray-50 group">
                <td className="px-4 py-3 text-sm text-gray-900 sticky left-0 bg-white group-hover:bg-gray-50 z-10 border-r border-gray-200 min-w-[120px]">
                  {formatAnswer(submission.contact.name)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 sticky left-[120px] bg-white group-hover:bg-gray-50 z-10 border-r border-gray-200 min-w-[200px]">
                  {formatAnswer(submission.contact.email)}
                </td>
                {questionColumns.map((questionId) => (
                  <td key={questionId} className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                    {formatAnswer(submission.answers[questionId])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const LeadsPage = () => {
  const { accessToken } = useAuth();
  const [page, setPage] = useState(1);
  const perPage = 25;

  const { data: submissionsResponse, isLoading: isLoadingSubmissions } = useQuery({
    queryKey: ["submissions", page],
    queryFn: () => {
      if (!accessToken) {
        throw new Error("No access token available");
      }
      return getSubmissions(accessToken, page, perPage);
    },
    enabled: !!accessToken,
  });

  const { data: forms, isLoading: isLoadingForms } = useQuery({
    queryKey: ["forms"],
    queryFn: () => {
      if (!accessToken) {
        throw new Error("No access token available");
      }
      return getForms(accessToken);
    },
    enabled: !!accessToken,
  });

  // Group submissions by form_key
  const groupedSubmissions = useMemo(() => {
    if (!submissionsResponse?.submissions || !forms) return [];

    const submissions = submissionsResponse.submissions;

    // Create a map of form_id to form
    const formMap = new Map<string, Form>();
    forms.forEach((form) => {
      formMap.set(form.id, form);
    });

    // Group submissions by form_key
    const grouped = new Map<string, { form: Form; submissions: Submission[] }>();

    submissions.forEach((submission) => {
      const form = formMap.get(submission.formId);
      if (!form) return; // Skip if form not found

      const existing = grouped.get(form.formKey);
      if (existing) {
        existing.submissions.push(submission);
      } else {
        grouped.set(form.formKey, { form, submissions: [submission] });
      }
    });

    // Sort submissions by submitted_at (newest first)
    grouped.forEach((group) => {
      group.submissions.sort((a, b) => {
        const dateA = new Date(a.submittedAt).getTime();
        const dateB = new Date(b.submittedAt).getTime();
        return dateB - dateA;
      });
    });

    return Array.from(grouped.values());
  }, [submissionsResponse?.submissions, forms]);

  const totalPages = submissionsResponse ? Math.ceil(submissionsResponse.total / perPage) : 0;
  const hasNextPage = submissionsResponse ? page < totalPages : false;
  const hasPrevPage = page > 1;

  const isLoading = isLoadingSubmissions || isLoadingForms;

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">Leads</h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!submissionsResponse || !forms) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">Leads</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading data</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Leads</h2>
          <p className="text-gray-600 mt-1">
            {submissionsResponse.total} total submission{submissionsResponse.total !== 1 ? "s" : ""}
            {submissionsResponse.total > 0 && (
              <> · Showing {((page - 1) * perPage) + 1}-{Math.min(page * perPage, submissionsResponse.total)}</>
            )}
          </p>
        </div>
      </div>

      {groupedSubmissions.length > 0 ? (
        <div>
          {groupedSubmissions.map((group) => (
            <SubmissionTable key={group.form.formKey} form={group.form} submissions={group.submissions} />
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="text-sm text-gray-700">
                Page {page} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!hasPrevPage || isLoadingSubmissions}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasNextPage || isLoadingSubmissions}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">No submissions found.</p>
        </div>
      )}
    </div>
  );
};

