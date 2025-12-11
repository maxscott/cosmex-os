import { type ApiError } from "@/api/methods";
import * as api from "@/api/methods";
import type { Memberable } from "@/types/organization";

// Guard function to ensure the response is valid organizations data
const guardOrganizationsResponse = (data: unknown): data is { organizations: Memberable[] } => {
  if (!data || typeof data !== "object") {
    return false;
  }

  if (!("organizations" in data)) {
    return false;
  }

  if (!Array.isArray(data.organizations)) {
    return false;
  }

  // Validate each supplier and brand has required fields
  const isValidMemberable = (item: unknown): boolean => {
    return (
      typeof item === "object" &&
      item !== null &&
      "id" in item &&
      typeof (item as { id: unknown }).id === "string" &&
      "type" in item &&
      typeof (item as { type: unknown }).type === "string" &&
      "displayName" in item &&
      typeof (item as { displayName: unknown }).displayName === "string" &&
      "role" in item &&
      typeof (item as { role: unknown }).role === "string"
    );
  };

  return data.organizations.every(isValidMemberable);
};

export const getOrganizations = async (token: string): Promise<Memberable[]> => {
  const data = await api.get({ endpoint: "/organizations", token });

  if (!guardOrganizationsResponse(data)) {
    console.warn(data);
    throw { message: "Invalid response: missing or invalid organizations data" } as ApiError;
  }

  return data.organizations;
};

