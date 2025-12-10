import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, X, Check } from "lucide-react";

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  formKey: string;
}

export const EmbedModal = ({ isOpen, onClose, formKey }: EmbedModalProps) => {
  const [onMouseLeave, setOnMouseLeave] = useState(false);
  const [triggerAfterTime, setTriggerAfterTime] = useState(false);
  const [timeSeconds, setTimeSeconds] = useState(3);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  if (!isOpen) return null;

  const generateScriptTag = () => {
    const attrs: string[] = [];
    attrs.push(`form-key="${formKey}"`);

    if (triggerAfterTime) {
      const milliseconds = timeSeconds * 1000;
      attrs.push(`open-after-ms="${milliseconds}"`);
    }

    if (onMouseLeave) {
      attrs.push(`on-mouse-leave="true"`);
    }

    return `<script async src="https://cosmexlink.max-8d7.workers.dev/widget.js" ${attrs.join(" ")}></script>`;
  };

  const handleCopy = async () => {
    const scriptTag = generateScriptTag();
    try {
      await navigator.clipboard.writeText(scriptTag);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Embed Form</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="mouse-leave"
                checked={onMouseLeave}
                onChange={(e) => setOnMouseLeave(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="mouse-leave" className="text-sm font-medium text-gray-700">
                Triggering on mouse leave
              </label>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="trigger-after-time"
                  checked={triggerAfterTime}
                  onChange={(e) => setTriggerAfterTime(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="trigger-after-time" className="text-sm font-medium text-gray-700">
                  <span>Trigger after </span><span>
                    <input
                      type="number"
                      id="time-seconds"
                      min="3"
                      max="60"
                      value={triggerAfterTime ? timeSeconds : ""}
                      disabled={!triggerAfterTime}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        if (value >= 3 && value <= 60) {
                          setTimeSeconds(value);
                        }
                      }}
                      className="w-12 px-1 py-1 text-center border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </span>
                  <span> seconds</span>
                  <span className="text-xs text-gray-500 ml-2">(between 3-60 seconds)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Code Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Embed Code
            </label>
            <div className="relative">
              <pre className="min-h-24 bg-gray-50 border border-gray-200 rounded-md p-4 text-sm overflow-x-auto">
                <code className="text-gray-800 text-wrap">{generateScriptTag()}</code>
              </pre>
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

