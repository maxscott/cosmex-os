import { createContext } from "react";

export interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (accessToken: string) => void;
  logout: () => void;
  isLoading: boolean;
  user: unknown;
  error: unknown;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

