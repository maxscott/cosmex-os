import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { getMe, refreshTokens } from "@/api/auth";
import { sleep } from "@/lib/utils";
import type { UserData } from "@/types/user";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isFetchingRef = useRef(false);

  const getCurrentUserHandler = async (accessToken: string) => {
    if (isFetchingRef.current) {
      return; // Already fetching, skip
    }
    isFetchingRef.current = true;
    try {
      const userData = await getMe(accessToken);
      setUser(userData);
      setIsLoading(false);
    } catch (error) {
      handleError(error);
    } finally {
      isFetchingRef.current = false;
    }
  }

  const refreshTokensHandler = async () => {
    const newAccessToken = await refreshTokens();
    setAccessToken(newAccessToken);
    // Don't call getCurrentUserHandler here - let the useEffect handle it when accessToken changes
    return newAccessToken;
  }

  const handleError = (error: unknown) => {
    setError(error);
    setIsLoading(false);
  }

  useEffect(() => {
    const initializeAuth = async () => {
      if (accessToken && user) {
        return;
      }

      // Prevent duplicate calls
      if (isFetchingRef.current) {
        return;
      }

      let triedRefresh = false;

      try {
        if (accessToken) {
          await getCurrentUserHandler(accessToken);
          return;
        }
        if (!accessToken) {
          triedRefresh = true;
          await refreshTokensHandler();
          // accessToken will be set, which will trigger this effect again to call getCurrentUserHandler
          return;
        }
      } catch (error1) {
        handleError(error1);
        try {
          if (triedRefresh) {
            handleError(error1);
            return;
          } else {
            if (isFetchingRef.current) {
              return;
            }
            await refreshTokensHandler();
            // accessToken will be set, which will trigger this effect again to call getCurrentUserHandler
            return;
          }
        } catch (error) {
          handleError(error);
          return;
        }
      }
    };
    initializeAuth();
  }, [accessToken, user]);

  const logout = async () => {
    await sleep(1000);
    setAccessToken(null);
    setUser(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
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

