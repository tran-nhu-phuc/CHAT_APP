import { AxiosError } from 'axios';
import { userApi } from '../apis/users';

const getAllUsers = async () => {
  try {
    return await userApi.getAllUsers();
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    }
  }
};

const getMembersByRoomId = async (roomId: number) => {
  return await userApi.getMembersByRoomId(roomId);
};

export const userService = { getAllUsers, getMembersByRoomId };
