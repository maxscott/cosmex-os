import { createContext } from "react";

export interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (accessToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

