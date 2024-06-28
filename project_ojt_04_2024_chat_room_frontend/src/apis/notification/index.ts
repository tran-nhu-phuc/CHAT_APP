import { ENDPOINT } from '../../common/endpoint';
import { ApiService } from '../api.service';

const getAllNotificationApi = async (requestConfig?: { url?: string }) => {
  return await ApiService.GET(`${ENDPOINT.NOTIFICATION}/${requestConfig?.url}`, {});
};
const updateNotificationApi = async (notificationId: number) => {
  return await ApiService.PATCH(`${ENDPOINT.NOTIFICATION}/${notificationId}`, {}, {});
};

export const notificationApi = { getAllNotificationApi, updateNotificationApi };
