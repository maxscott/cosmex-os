
export interface ApiError {
  message: string;
  status?: number;
}

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

/**
 * Exchanges an authorization code for access and refresh tokens
 * @param code - The authorization code from the OAuth callback
 * @returns Promise resolving to tokens or throwing an error
 */

export const post = async ({ endpoint, body, token }: { endpoint: string; body?: unknown; token?: string; }): Promise<unknown> => {
  try {
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const method = "POST";
    const bodyStr = body ? JSON.stringify(body) : undefined;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { method, headers, body: bodyStr });

    if (!response.ok) {
      const error: ApiError = {
        message: `Failed to exchange code: ${response.statusText}`,
        status: response.status,
      };
      throw error;
    }

    return response.json();
  } catch (err) {
    if (err && typeof err === "object" && "message" in err) {
      throw err;
    }
    throw {
      message: err instanceof Error ? err.message : "An error has occurred",
    } as ApiError;
  }
};
