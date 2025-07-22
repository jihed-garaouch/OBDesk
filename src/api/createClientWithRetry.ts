import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from "axios";

type CreateClientOptions = {
  baseURL: string;
  label: string;
  maxRetries?: number;
  baseDelay?: number;
  config?: Record<string, any>;
};

export const createClientWithRetry = ({
  baseURL,
  label,
  maxRetries = 3,
  baseDelay = 1000,
  config,
}: CreateClientOptions): AxiosInstance => {
  const client = axios.create({ baseURL, ...config });

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: number;
      };

      // Initialize retry count
      if (!originalRequest._retry) {
        originalRequest._retry = 0;
      }

      // Handle 429 Rate Limiting
      if (error.response?.status === 429 && originalRequest._retry < maxRetries) {
        originalRequest._retry += 1;

        const retryAfter = error.response.headers["retry-after"];
        const delay = retryAfter
          ? parseInt(retryAfter) * 1000
          : baseDelay * Math.pow(2, originalRequest._retry - 1);

        console.warn(
          `${label} Rate limited. Retrying after ${delay}ms (attempt ${originalRequest._retry}/${maxRetries})`
        );

        await new Promise((resolve) => setTimeout(resolve, delay));
        return client(originalRequest);
      }

      // Handle other errors with exponential backoff
      if (
        error.code === "ECONNABORTED" ||
        error.code === "ERR_NETWORK" ||
        (error.response && error.response.status >= 500)
      ) {
        if (originalRequest._retry < maxRetries) {
          originalRequest._retry += 1;

          const delay = baseDelay * Math.pow(2, originalRequest._retry - 1);
          console.warn(
            `${label} Request failed. Retrying after ${delay}ms (attempt ${originalRequest._retry}/${maxRetries})`
          );

          await new Promise((resolve) => setTimeout(resolve, delay));
          return client(originalRequest);
        }
      }

      console.error(`${label} Error:`, error?.response?.data || error.message);
      return Promise.reject(error);
    }
  );

  return client;
};