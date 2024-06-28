import { AxiosRequestConfig } from 'axios';
import axiosInstance from './config.api';
import { handleErrorApi } from '../utilities/error.util';

const get = async (endpoint: string, requestConfig: AxiosRequestConfig = {}) => {
  try {
    const result = await axiosInstance.get(endpoint, requestConfig);
    return result;
  } catch (error) {
    handleErrorApi(error);
  }
};

const post = async <D>(endpoint: string, data: D, requestConfig: AxiosRequestConfig = {}) => {
  try {
    return await axiosInstance.post(endpoint, data, requestConfig);
  } catch (error) {
    handleErrorApi(error);
  }
};

const put = async <D>(endpoint: string, data: D, requestConfig: AxiosRequestConfig = {}) => {
  try {
    return await axiosInstance.put(endpoint, data, requestConfig);
  } catch (error) {
    handleErrorApi(error);
  }
};

const patch = async <D>(endpoint: string, data: D, requestConfig: AxiosRequestConfig = {}) => {
  try {
    return await axiosInstance.patch(endpoint, data, requestConfig);
  } catch (error) {
    handleErrorApi(error);
  }
};

const deleteApi = async (endpoint: string, requestConfig: AxiosRequestConfig = {}) => {
  try {
    return await axiosInstance.delete(endpoint, requestConfig);
  } catch (error) {
    handleErrorApi(error);
  }
};

export const API = { get, post, put, patch, delete: deleteApi };
