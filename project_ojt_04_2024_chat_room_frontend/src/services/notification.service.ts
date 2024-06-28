import { notificationApi } from '../apis/notification';

const getAllNotifications = async (endpoint?: string) => {
  try {
    const result = await notificationApi.getAllNotificationApi({ url: endpoint });
    return result;
  } catch (error) {
    throw error;
  }
};
const updateNotificationStatus = async (notificationId: number) => {
  try {
    const result = await notificationApi.updateNotificationApi(notificationId);
    return result;
  } catch (error) {
    throw error;
  }
};

export const notificationService = { getAllNotifications, updateNotificationStatus };
