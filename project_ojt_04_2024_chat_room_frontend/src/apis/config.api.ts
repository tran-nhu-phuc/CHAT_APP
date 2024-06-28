import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken } from '../utilities/token.util';

export const API_BASE_URL = 'http://127.0.0.1:8080';
export const AUTHORIZATION_PREFIX = 'Bearer ';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.defaults.headers.common = {
  'Content-Type': 'application/json',
};

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  config.headers.Authorization = AUTHORIZATION_PREFIX + getAccessToken();
  return config;
});

export default axiosInstance;
