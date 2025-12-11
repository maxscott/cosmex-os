import type { UserData } from "@/types/user";
import { createContext } from "react";

export interface AuthContextType {
  setAccessToken: (accessToken: string) => void;
  logout: () => void;
  isLoading: boolean;
  user: UserData | null;
  error: unknown;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

