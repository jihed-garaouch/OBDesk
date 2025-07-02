import axios, { type AxiosInstance } from "axios";

type CreateClientOptions = {
  baseURL: string;
  label: string;
  config?: Record<string, any>;
};

export const createClient = ({ baseURL, label, config }: CreateClientOptions): AxiosInstance => {
  const client = axios.create({ baseURL, ...config });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error(`${label} Error:`, error?.response?.data || error.message);
      return Promise.reject(error);
    }
  );

  return client;
};
