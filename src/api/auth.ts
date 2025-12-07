import { type ApiError } from "@/api/methods";
import * as api from "@/api/methods";

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
  const data = await api.post({ endpoint: "/auth/refresh" });

  if (!guardTokenResponse(data)) {
    console.warn(data);
    throw { message: "Invalid response: missing access token on refresh" } as ApiError;
  }

  return data.accessToken;
};

export const getAuthenticationUrl = async (): Promise<string> => {
  const data = await api.get({ endpoint: "/auth/url" });

  if (!data || typeof data !== "object" || !("url" in data) || typeof data.url !== "string") {
    throw { message: "Invalid response: missing workos url" } as ApiError;
  }

  return data.url;
};

export const getMe = async (token: string): Promise<unknown> => {
  const data = await api.get({ endpoint: "/auth/me", token });
  return data;
};

