import axios, { AxiosError, AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'https://api.nagarsathi.local';

const TOKEN_KEY = 'nagarsathi_access_token';

export const getStoredToken = async (): Promise<string | null> =>
  SecureStore.getItemAsync(TOKEN_KEY);

export const setStoredToken = async (token: string): Promise<void> =>
  SecureStore.setItemAsync(TOKEN_KEY, token);

export const clearStoredToken = async (): Promise<void> =>
  SecureStore.deleteItemAsync(TOKEN_KEY);

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError<{ message?: string }>) => {
    const message =
      error.response?.data?.message ??
      error.message ??
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);
