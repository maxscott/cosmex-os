import { refreshTokens } from "./auth";

export interface ApiError {
  message: string;
  status?: number;
}

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

/**
 * Makes a POST request to the API
 * @param endpoint - The endpoint to call
 * @param body - The body of the request
 * @param token - The token to use for authentication
 * @returns Promise resolving to the response or throwing an error
 */
export const post = async ({ endpoint, body }: { endpoint: string; body?: unknown; }): Promise<unknown> => {
  return baseHttpCall({ method: "POST", endpoint, body });
};

/**
 * Makes a GET request to the API
 * @param endpoint - The endpoint to call
 * @param token - The token to use for authentication
 * @returns Promise resolving to the response or throwing an error
 */
export const get = async ({ endpoint }: { endpoint: string; }): Promise<unknown> => {
  return baseHttpCall({ method: "GET", endpoint });
};

/**
 * Makes a PUT request to the API
 * @param endpoint - The endpoint to call
 * @param body - The body of the request
 * @param token - The token to use for authentication
 * @returns Promise resolving to the response or throwing an error
 */
export const put = async ({ endpoint, body }: { endpoint: string; body?: unknown; }): Promise<unknown> => {
  return baseHttpCall({ method: "PUT", endpoint, body });
};

/**
 * Makes a DELETE request to the API
 * @param endpoint - The endpoint to call
 * @param token - The token to use for authentication
 * @returns Promise resolving to the response or throwing an error
 */
export const del = async ({ endpoint }: { endpoint: string; }): Promise<unknown> => {
  return baseHttpCall({ method: "DELETE", endpoint });
};

/**
 * Makes a base HTTP call to the API
 * @param method - The HTTP method to use
 * @param endpoint - The endpoint to call
 * @param body - The body of the request
 * @param token - The token to use for authentication
 * @returns Promise resolving to the response or throwing an error
 */
export const baseHttpCall = async ({
  method,
  endpoint,
  body,
  retried = false,
}: {
  method: string;
  endpoint: string;
  body?: unknown;
  retried?: boolean;
}): Promise<unknown> => {
  try {
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    const supplierId = localStorage.getItem("coid");
    headers.set("X-Organization-Id", supplierId ?? "");
    // if (token) headers.set("Authorization", `Bearer ${token}`);
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      if (!retried && response.status === 401) {
        const errorBody = await response.json();
        if (errorBody?.error?.toLowerCase().includes("expired")) {
          await refreshTokens();
          return baseHttpCall({ method, endpoint, body, retried: true });
        }
      }
      const error: ApiError = {
        message: `Failed to ${method} data: ${response.statusText}`,
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