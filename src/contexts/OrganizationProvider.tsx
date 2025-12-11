import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { OrganizationContext } from "@/contexts/OrganizationContext";
import { getOrganizations } from "@/api/organizations";
import { useAuth } from "@/contexts/useAuth";

const CURRENT_ORG_KEY = 'coid';

interface OrganizationProviderProps {
  children: ReactNode;
}

export const OrganizationProvider = ({ children }: OrganizationProviderProps) => {
  const { user } = useAuth();
  const [orgId, setOrgId] = useState(() => {
    return localStorage.getItem(CURRENT_ORG_KEY) ?? null;
  });

  const { data: organizations, isLoading, error } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => {
      if (!user) {
        return null;
      }
      return getOrganizations();
    },
    enabled: !!user, // Only fetch if we have both an access token and a user
  });

  // real current org depends on both query + stored id
  const currentOrganization = useMemo(() => {
    if (!organizations?.length) return null;
    const byStorage = orgId ? organizations.find(o => o.id === orgId) : null;
    return byStorage ?? organizations[0];
  }, [organizations, orgId]);

  // set current organization in localStorage
  const setCurrentOrganization = useCallback((orgId: string | null) => {
    if (orgId) {
      localStorage.setItem(CURRENT_ORG_KEY, orgId);
    } else {
      localStorage.removeItem(CURRENT_ORG_KEY);
    }
    setOrgId(orgId);
  }, []);

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

