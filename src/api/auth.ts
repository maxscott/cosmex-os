import { post, type ApiError } from "@/api/post";

const ERROR_MESSAGE = "Invalid response: missing access token on refresh";

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
  const data = await post({ endpoint: "/auth/exchange", body: { code } });

  if (!guardTokenResponse(data)) {
    throw { message: ERROR_MESSAGE } as ApiError;
  }

  return data.accessToken;
};

export const refreshTokens = async (): Promise<string> => {
  const data = await post({ endpoint: "/auth/refresh" });

  if (!guardTokenResponse(data)) {
    throw { message: ERROR_MESSAGE } as ApiError;
  }

  return data.accessToken;
};

