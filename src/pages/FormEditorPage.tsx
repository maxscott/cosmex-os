import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createForm } from "@/api/forms";
import { useAuth } from "@/contexts/useAuth";
import type { FormSchema, FormQuestion } from "@/types/form";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Save, X } from "lucide-react";

// Sample form data from fixtures
const sampleFormData: FormSchema = {
  title: "Private Label Labs New Client",
  description: "Let's learn more about you business and how we can help",
  questions: [
    {
      id: "q1",
      text: "Are you launching a new brand or growing an existing one?",
      type: "multiple-choice",
      options: [
        "I'm starting a new brand",
        "I already have a brand",
        "I'm just rearching options for now",
      ],
    },
    {
      id: "q2",
      text: "What product categories are you most interested in?",
      type: "multiple-choice",
      options: [
        "Skincare(serums creams oils)",
        "Haircare(shampoo conditioner oils)",
        "Body care(butters scrubs balms)",
        "Men's grooming(beard oil tattoo aftercare)",
        "Wellness or specialty(tallow plant - based)",
        "Not sure yet",
        "Other",
      ],
    },
    {
      id: "q3",
      text: "How soon are you planning to launch or restock ?",
      type: "multiple-choice",
      options: [
        "In the next 7 days",
        "In 2 weeks",
        "Next month",
        "1–3 months",
        "3–6 months",
        "Just browsing ideas",
      ],
    },
    {
      id: "q4",
      text: "Are we creating a new formula or reverse engineering an existing one?",
      type: "multiple-choice",
      options: [
        "Create a new custom formula from scratch",
        "Reverse engineer a product I already like",
        "Private label one of your existing in-house formulas",
        "Not sure yet — need guidance",
      ],
    },
    {
      id: "q5",
      text: "What's your estimated order size?",
      type: "multiple-choice",
      options: [
        "Under 100 units",
        "100–500 units",
        "500–1,000",
        "1,000-5,000+",
      ],
    },
  ],
  contactFields: {
    name: { required: true, label: "Full Name" },
    email: { required: true, label: "Email Address" },
    phone: { required: false, label: "Phone Number" },
    website: { required: false, label: "Website" },
    notes: { required: false, label: "Notes" },
  },
  submissionTitle: "Almost Done!",
  submissionDescription: "Where should we send your personalized quote?",
  completionTitle: "Thank You!",
  completionDescription: "Your responses have been submitted successfully.",
};

const generateQuestionId = () => `q${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const FormEditorPage = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [schema, setSchema] = useState<FormSchema>(structuredClone(sampleFormData));
  const [supplierId, setSupplierId] = useState<string>("");

  // Get supplier_id from existing forms if available
  useEffect(() => {
    const fetchSupplierId = async () => {
      if (!accessToken) return;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/forms`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          const forms = await response.json();
          if (forms && forms.length > 0) {
            setSupplierId(forms[0].supplierId);
          }
        }
      } catch (error) {
        console.error("Failed to fetch supplier ID:", error);
      }
    };
    fetchSupplierId();
  }, [accessToken]);

  const createFormMutation = useMutation({
    mutationFn: (formSchema: FormSchema) => {
      if (!accessToken) {
        throw new Error("No access token available");
      }
      if (!supplierId) {
        throw new Error("Supplier ID is required");
      }
      return createForm(accessToken, supplierId, formSchema);
    },
    onSuccess: () => {
      navigate("/crm/forms");
    },
    onError: (error) => {
      console.error("Failed to create form:", error);
      alert(`Failed to create form: ${error instanceof Error ? error.message : "Unknown error"}`);
    },
  });

  const handleSave = () => {
    createFormMutation.mutate(schema);
  };

  const updateSchema = (updates: Partial<FormSchema>) => {
    setSchema((prev) => ({ ...prev, ...updates }));
  };

  const addQuestion = () => {
    const newQuestion: FormQuestion = {
      id: generateQuestionId(),
      text: "",
      type: "text",
    };
    updateSchema({
      questions: [...(schema.questions || []), newQuestion],
    });
  };

  const updateQuestion = (index: number, updates: Partial<FormQuestion>) => {
    const questions = [...(schema.questions || [])];
    questions[index] = { ...questions[index], ...updates };
    updateSchema({ questions });
  };

  const removeQuestion = (index: number) => {
    const questions = [...(schema.questions || [])];
    questions.splice(index, 1);
    updateSchema({ questions });
  };

  const addQuestionOption = (questionIndex: number) => {
    const questions = [...(schema.questions || [])];
    const question = questions[questionIndex];
    if (!question.options) {
      question.options = [];
    }
    question.options.push("");
    updateSchema({ questions });
  };

  const updateQuestionOption = (questionIndex: number, optionIndex: number, value: string) => {
    const questions = [...(schema.questions || [])];
    const question = questions[questionIndex];
    if (question.options) {
      question.options[optionIndex] = value;
      updateSchema({ questions });
    }
  };

  const removeQuestionOption = (questionIndex: number, optionIndex: number) => {
    const questions = [...(schema.questions || [])];
    const question = questions[questionIndex];
    if (question.options) {
      question.options.splice(optionIndex, 1);
      updateSchema({ questions });
    }
  };

  const togglePhoneRequired = () => {
    const contactFields = { ...(schema.contactFields || {}) };
    if (contactFields.phone) {
      contactFields.phone.required = !contactFields.phone.required;
    } else {
      contactFields.phone = { required: true, label: "Phone Number" };
    }
    updateSchema({ contactFields });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create New Form</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/crm/forms")}>
            <X className="w-4 h-4" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={createFormMutation.isPending}>
            <Save className="w-4 h-4" />
            {createFormMutation.isPending ? "Saving..." : "Save Form"}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Basic Information</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={schema.title || ""}
              onChange={(e) => updateSchema({ title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Form Title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={schema.description || ""}
              onChange={(e) => updateSchema({ description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Form Description"
            />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Questions</h2>
            <Button variant="outline" size="sm" onClick={addQuestion}>
              <Plus className="w-4 h-4" />
              Add Question
            </Button>
          </div>

          {schema.questions?.map((question, index) => (
            <div
              key={question.id}
              className="border border-gray-200 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question Text *
                    </label>
                    <input
                      type="text"
                      value={question.text}
                      onChange={(e) =>
                        updateQuestion(index, { text: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter question text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question Type *
                    </label>
                    <select
                      value={question.type}
                      onChange={(e) =>
                        updateQuestion(index, { type: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="text">Text</option>
                      <option value="textarea">Textarea</option>
                      <option value="email">Email</option>
                      <option value="number">Number</option>
                      <option value="multiple-choice">Multiple Choice</option>
                    </select>
                  </div>
                  {question.type === "multiple-choice" && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Options *
                      </label>
                      {question.options?.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex gap-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              updateQuestionOption(index, optionIndex, e.target.value)
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Option ${optionIndex + 1}`}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeQuestionOption(index, optionIndex)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addQuestionOption(index)}
                      >
                        <Plus className="w-4 h-4" />
                        Add Option
                      </Button>
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeQuestion(index)}
                  className="ml-4"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Fields */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Contact Fields</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={schema.contactFields?.phone?.required || false}
                onChange={togglePhoneRequired}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Require Phone Number
              </span>
            </label>
          </div>
        </div>

        {/* Submission & Completion Messages */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Messages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Submission Title
              </label>
              <input
                type="text"
                value={schema.submissionTitle || ""}
                onChange={(e) => updateSchema({ submissionTitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Almost Done!"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Completion Title
              </label>
              <input
                type="text"
                value={schema.completionTitle || ""}
                onChange={(e) => updateSchema({ completionTitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Thank You!"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Submission Description
              </label>
              <textarea
                value={schema.submissionDescription || ""}
                onChange={(e) => updateSchema({ submissionDescription: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Where should we send your personalized quote?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Completion Description
              </label>
              <textarea
                value={schema.completionDescription || ""}
                onChange={(e) => updateSchema({ completionDescription: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Your responses have been submitted successfully."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

