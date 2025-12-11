import { useState, useEffect, useRef, useCallback } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { getMe } from "@/api/auth";
import { sleep } from "@/lib/utils";
import type { UserData } from "@/types/user";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isFetchingRef = useRef(false);

  const getCurrentUserHandler = useCallback(async () => {
    if (isFetchingRef.current) {
      return; // Already fetching, skip
    }
    isFetchingRef.current = true;
    try {
      const userData = await getMe();
      setUser(userData);
      setIsLoading(false);
    } catch (error) {
      handleError(error);
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  const handleError = (error: unknown) => {
    setError(error);
    setIsLoading(false);
  }

  useEffect(() => {
    const initializeAuth = async () => {
      if (user || isFetchingRef.current) {
        return;
      }

      try {
        await getCurrentUserHandler(); // empty string is a valid token
        return;
      } catch (error) {
        handleError(error);
        return;
      }
    };
    initializeAuth();
  }, [user, getCurrentUserHandler]);

  const setAccessToken = useCallback((accessToken: string) => {
    localStorage.setItem("accessToken", accessToken);
  }, []);

  const logout = async () => {
    await sleep(1000);
    localStorage.removeItem("accessToken");
    setUser(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        setAccessToken,
        logout,
        user,
        error,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

