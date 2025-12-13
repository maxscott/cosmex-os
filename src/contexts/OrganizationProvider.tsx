import { useCallback, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { OrganizationContext } from "@/contexts/OrganizationContext";
import { getOrganizations } from "@/api/organizations";
import type { Memberable } from "@/types/organization";

const CURRENT_ORG_KEY = 'coid';

interface OrganizationProviderProps {
  children: ReactNode;
}

export const OrganizationProvider = ({ children }: OrganizationProviderProps) => {
  const [currentOrganization, setCurrentOrganizationObject] = useState<Memberable | null>(null);

  const { data: organizations, isLoading, error } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const organizations = await getOrganizations();

      if (!organizations || !organizations[0]) {
        return null;
      }

      const orgId = localStorage.getItem(CURRENT_ORG_KEY);
      const currentOrganization = orgId ? organizations.find(o => o.id === orgId) : organizations[0];

      if (currentOrganization) {
        setCurrentOrganizationObject(currentOrganization);
        localStorage.setItem(CURRENT_ORG_KEY, currentOrganization.id);
      } else {
        setCurrentOrganizationObject(null);
        localStorage.removeItem(CURRENT_ORG_KEY);
      }

      return organizations;
    }
  });

  // set current organization in localStorage
  const setCurrentOrganization = useCallback((orgId: string | null) => {
    if (orgId) {
      localStorage.setItem(CURRENT_ORG_KEY, orgId);
    } else {
      localStorage.removeItem(CURRENT_ORG_KEY);
    }
    setCurrentOrganizationObject(orgId ? organizations?.find(o => o.id === orgId) ?? null : null);
  }, [organizations]);

  return (
    <OrganizationContext.Provider
      value={{
        organizations: organizations || null,
        isLoading,
        error,
        currentOrganization,
        setCurrentOrganization,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

