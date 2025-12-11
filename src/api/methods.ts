
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
export const post = async ({ endpoint, body, token }: { endpoint: string; body?: unknown; token?: string; }): Promise<unknown> => {
  return baseHttpCall({ method: "POST", endpoint, body, token });
};

/**
 * Makes a GET request to the API
 * @param endpoint - The endpoint to call
 * @param token - The token to use for authentication
 * @returns Promise resolving to the response or throwing an error
 */
export const get = async ({ endpoint, token }: { endpoint: string; token?: string; }): Promise<unknown> => {
  return baseHttpCall({ method: "GET", endpoint, token });
};

/**
 * Makes a PUT request to the API
 * @param endpoint - The endpoint to call
 * @param body - The body of the request
 * @param token - The token to use for authentication
 * @returns Promise resolving to the response or throwing an error
 */
export const put = async ({ endpoint, body, token }: { endpoint: string; body?: unknown; token?: string; }): Promise<unknown> => {
  return baseHttpCall({ method: "PUT", endpoint, body, token });
};

/**
 * Makes a DELETE request to the API
 * @param endpoint - The endpoint to call
 * @param token - The token to use for authentication
 * @returns Promise resolving to the response or throwing an error
 */
export const del = async ({ endpoint, token }: { endpoint: string; token?: string; }): Promise<unknown> => {
  return baseHttpCall({ method: "DELETE", endpoint, token });
};

/**
 * Makes a base HTTP call to the API
 * @param method - The HTTP method to use
 * @param endpoint - The endpoint to call
 * @param body - The body of the request
 * @param token - The token to use for authentication
 * @returns Promise resolving to the response or throwing an error
 */
export const baseHttpCall = async ({ method, endpoint, body, token }: { method: string; endpoint: string; body?: unknown; token?: string; }): Promise<unknown> => {
  try {
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    const supplierId = localStorage.getItem("coid");
    headers.set("X-Organization-Id", supplierId ?? "");
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
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