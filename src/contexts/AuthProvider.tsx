import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { getMe } from "@/api/auth";
import { sleep } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, _setAccessToken] = useState<string | null>(localStorage.getItem("accessToken") ?? null);
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: async () => await getMe(),
    retry: false,
  });

  const logout = async () => {
    localStorage.removeItem("accessToken");
    _setAccessToken(null);
    await sleep(1000);
  };

  const setAccessToken = (accessToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    _setAccessToken(accessToken);
    queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        logout,
        user: user ?? null,
        error,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

