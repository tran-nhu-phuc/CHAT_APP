import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ENDPOINT } from '../../common/endpoint';
import { UserInRoomResponse } from './responses/user-in-room.response';
import { ApiService } from '../api.service';

const listRoomByUserApi = async (
  requestConfig?: AxiosRequestConfig,
): Promise<AxiosResponse<any, any> | UserInRoomResponse | undefined> => {
  try {
    return await ApiService.GET(
      `${ENDPOINT.USER_IN_ROOM.BASE}/${ENDPOINT.USER_IN_ROOM.BY_USER}/${requestConfig?.url}`,
      {},
    );
  } catch (error) {
    throw error;
  }
};

const listUsersByRoom = async (
  requestConfig?: AxiosRequestConfig,
): Promise<AxiosResponse<any, any> | UserInRoomResponse | undefined> => {
  try {
    const result = await ApiService.GET(
      `${ENDPOINT.USER_IN_ROOM.BASE}/${ENDPOINT.USER_IN_ROOM.BY_ROOM}/${requestConfig?.url}`,
      {},
    );
    return result;
  } catch (error) {
    console.log(error);

    throw error;
  }
};

export const roomApi = {
  listRoomByUserApi,
  listUsersByRoom,
};
