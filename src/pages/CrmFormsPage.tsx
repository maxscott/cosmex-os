import { useQuery } from "@tanstack/react-query";
import { getForms } from "@/api/forms";
import { useAuth } from "@/contexts/useAuth";
import type { Form } from "@/types/form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const QuestionTypeBadge = ({ type }: { type: string }) => {
  const colorMap: Record<string, string> = {
    "multiple-choice": "bg-blue-100 text-blue-800",
    "text": "bg-green-100 text-green-800",
    "textarea": "bg-purple-100 text-purple-800",
    "email": "bg-yellow-100 text-yellow-800",
    "number": "bg-pink-100 text-pink-800",
  };

  const colorClass = colorMap[type] || "bg-gray-100 text-gray-800";

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>
      {type}
    </span>
  );
};

const FormCard = ({ form }: { form: Form }) => {
  const questions = form.schema.questions || [];
  const contactFields = form.schema.contactFields || {};
  const contactFieldEntries = Object.entries(contactFields);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="">
          <h3 className="text-lg font-semibold text-gray-900">{form.schema.title}</h3>
          <p className="text-sm text-gray-500 mt-1">
            Key: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{form.formKey}</code>
            {" · "}
            Version: <span className="font-medium">{form.version}</span>
          </p>
        </div>
      </div>

      {form.schema.description && (
        <p className="text-sm text-gray-600 mb-3">{form.schema.description}</p>
      )}

      {questions.length > 0 ? (
        <div className="mt-3 space-y-2">
          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Questions ({questions.length})
          </h4>
          <div className="space-y-1.5">
            {questions.map((question) => (
              <div
                key={question.id}
                className="flex items-start gap-2 text-sm py-1.5 border-b border-gray-100 last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-500 text-xs font-mono">{question.id}</span>
                    <QuestionTypeBadge type={question.type} />
                  </div>
                  <p className="text-gray-800 truncate">{question.text}</p>
                  {question.options && question.options.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {question.options.length} option{question.options.length !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {contactFieldEntries.length > 0 && (
              <div className="py-1.5 ">
                <p className="text-xs text-gray-500 mb-1">Contact Fields</p>
                <div className="flex flex-wrap gap-1.5">
                  {contactFieldEntries.map(([fieldKey, fieldConfig]) => (
                    <span
                      key={fieldKey}
                      className={`px-2 py-0.5 rounded text-xs font-medium ${fieldConfig.required
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {fieldKey}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">No questions defined</p>
      )}
    </div>
  );
};

export const CrmFormsPage = () => {
  const { accessToken } = useAuth();

  const { data: forms, isLoading, error } = useQuery({
    queryKey: ["forms"],
    queryFn: () => {
      if (!accessToken) {
        throw new Error("No access token available");
      }
      return getForms(accessToken);
    },
    enabled: !!accessToken,
  });

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            Error loading forms: {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>

      {forms && forms.length > 0 ? (
        <div className="md:w-xl lg:w-2xl md:mx-auto grid grid-cols-1 gap-4">
          {forms.map((form) => (
            <FormCard key={form.id} form={form} />
          ))}

          <Button variant="outline" size="lg" className="w-full py-8 text-gray-500 border-dashed border-gray-300">
            <Plus className="w-4 h-4" /> Create New Form
          </Button>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">No forms found.</p>
        </div>
      )}
    </div>
  );
};

