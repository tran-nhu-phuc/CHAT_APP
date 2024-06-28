import { AxiosRequestConfig } from 'axios';
import { ENDPOINT } from '../../common/endpoint';
import { ApiService } from '../api.service';

const listMessageByRoom = async (requestConfig?: AxiosRequestConfig) => {
  try {
    return await ApiService.GET(`/${ENDPOINT.MESSAGES.BASE}/${requestConfig?.url}`, {});
  } catch (error) {
    throw error;
  }
};

export const messageApi = {
  listMessageByRoom,
};
