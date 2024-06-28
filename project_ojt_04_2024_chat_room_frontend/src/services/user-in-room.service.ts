import { roomApi } from '../apis/user-in-room';

const listRoomByUserApi = async (endpoint: string) => {
  try {
    return await roomApi.listRoomByUserApi({ url: endpoint });
  } catch (error) {
    throw error;
  }
};

const listUsersByRoom = async (endpoint: string) => {
  try {
    return await roomApi.listUsersByRoom({ url: endpoint });
  } catch (error) {
    throw error;
  }
};
export const userInRoomService = {
  listRoomByUserApi,
  listUsersByRoom,
};
