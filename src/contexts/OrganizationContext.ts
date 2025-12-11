import { createContext } from "react";
import type { Memberable } from "@/types/organization";

export interface OrganizationContextType {
  organizations: Memberable[] | null;
  isLoading: boolean;
  error: unknown;
  currentOrganization: Memberable | null;
  setCurrentOrganization: (organizationId: string | null) => void;
}

export const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

