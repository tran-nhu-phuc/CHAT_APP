import { ENDPOINT } from '../../utilities/endpoint.ulti';
import { ApiService } from '../api.service';

const getAllUsers = async () => {
  return await ApiService.GET('/users', {});
};

const getMembersByRoomId = async (roomId: number) => {
  return await ApiService.GET(`/${ENDPOINT.USER}/${roomId}`, {});
};
export const userApi = { getAllUsers, getMembersByRoomId };
