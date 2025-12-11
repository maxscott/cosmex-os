import { API_BASE_URL, type ApiError } from "@/api/methods";
import * as api from "@/api/methods";
import type { UserData } from "@/types/user";

// a guard function to ensure the response is a valid token response
const guardTokenResponse = (data: unknown): data is { accessToken: string } => {
  if (!data || typeof data !== "object" || !("accessToken" in data)) {
    return false;
  }

  if (!(typeof data.accessToken === "string")) {
    return false;
  }

  return true;
};

export const getAccessToken = async (code: string): Promise<string> => {
  const data = await api.post({ endpoint: "/auth/exchange", body: { code } });

  if (!guardTokenResponse(data)) {
    console.warn(data);
    throw { message: "Invalid response: missing access token on exchange" } as ApiError;
  }

  return data.accessToken;
};

export const refreshTokens = async (): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw { message: "Failed to refresh tokens" } as ApiError;
  }

  const data = await response.json();

  if (!guardTokenResponse(data)) {
    console.warn(data);
    throw { message: "Invalid response: missing access token on refresh" } as ApiError;
  }

  localStorage.setItem("accessToken", data.accessToken);

  return data.accessToken;
};

export const getAuthenticationUrl = async (): Promise<string> => {
  const data = await api.get({ endpoint: "/auth/url" });

  if (!data || typeof data !== "object" || !("url" in data) || typeof data.url !== "string") {
    throw { message: "Invalid response: missing workos url" } as ApiError;
  }

  return data.url;
};

export const getMe = async (token: string): Promise<UserData> => {
  const data = await api.get({ endpoint: "/auth/me", token });

  if (!data || typeof data !== "object" ||
    !("id" in data) || typeof data.id !== "string" ||
    !("email" in data) || typeof data.email !== "string" ||
    !("emailVerified" in data) || typeof data.emailVerified !== "boolean" ||
    !("firstName" in data) || typeof data.firstName !== "string" ||
    !("lastName" in data) || typeof data.lastName !== "string" ||
    !("profilePictureUrl" in data) || typeof data.profilePictureUrl !== "string") {
    throw new Error("Invalid response: missing user data");
  }

  return data as UserData;
};

