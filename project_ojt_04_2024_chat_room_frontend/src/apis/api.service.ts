import { AxiosRequestConfig } from 'axios';
import axiosInstance from './config.api';
import { handleErrorApi } from '../utilities/error.util';

/**
 * Get data from the server
 *
 * @param endpoint - Endpoint
 * @param requestConfig - Request configuration
 * @returns AxiosResponse
 */
const GET = async (endpoint: string, requestConfig: AxiosRequestConfig = {}) => {
  try {
    return await axiosInstance.get(endpoint, requestConfig);
  } catch (error) {
    handleErrorApi(error);
  }
};

/**
 * Post data to the server
 *
 * @param endpoint - Endpoint
 * @param requestConfig - Request configuration
 * @returns AxiosResponse
 */
const POST = async <D>(endpoint: string, data: D, requestConfig: AxiosRequestConfig) => {
  try {
    return await axiosInstance.post(endpoint, data, requestConfig);
  } catch (error) {
    handleErrorApi(error);
  }
};

/**
 * Post data for server to edit old data
 *
 * @param endpoint - Endpoint
 * @param requestConfig - Request configuration
 * @returns AxiosResponse
 */
const PATCH = async <D>(endpoint: string, data: D, requestConfig: AxiosRequestConfig) => {
  try {
    return await axiosInstance.patch(endpoint, data, requestConfig);
  } catch (error) {
    handleErrorApi(error);
  }
};

/**
 * Delete data from server
 *
 * @param endpoint - Endpoint
 * @param requestConfig - Request configuration
 * @returns AxiosResponse
 */
const DELETE = async (endpoint: string, requestConfig: AxiosRequestConfig) => {
  try {
    return await axiosInstance.delete(endpoint, requestConfig);
  } catch (error) {
    handleErrorApi(error);
  }
};

export const ApiService = { GET, POST, PATCH, DELETE };
