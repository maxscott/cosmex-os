import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { getAccessToken } from "@/api/auth";
import { useAuth } from "@/contexts/useAuth";

export const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();
  const code = searchParams.get("code");

  const { isPending, isError, error, mutate } = useMutation({
    mutationFn: () => {
      if (!code) {
        throw new Error("No authorization code provided");
      }
      return getAccessToken(code);
    },
    onSuccess: (accessToken: string) => {
      setAccessToken(accessToken);

      // Redirect to home after a brief delay
      setTimeout(() => {
        navigate("/");
      }, 3000);
    },
  });

  useEffect(() => { if (code) mutate(); }, [code, mutate]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Completing authentication...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    const errorMessage =
      error && typeof error === "object" && "message" in error
        ? (error as { message: string }).message
        : "An error occurred during authentication";

    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Authentication Failed</div>
          <p className="text-gray-600 mb-4">{errorMessage}</p>
          <a
            href="/auth/login"
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 inline-block"
          >
            Return to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="text-green-600 text-xl mb-4">Authentication Successful!</div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};

