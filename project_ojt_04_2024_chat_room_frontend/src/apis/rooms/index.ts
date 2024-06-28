/* eslint-disable @typescript-eslint/no-explicit-any */
import { ENDPOINT } from '../../utilities/endpoint.ulti';
import { ApiService } from '../api.service';

const createRoom = async () => {
  await ApiService.POST('', {}, {});
};

const getDataRoom = async (limit: number) => {
  return await ApiService.GET(ENDPOINT.ROOM, { params: { limit } });
};

const deleteRoom = async (id: number) => {
  return await ApiService.PATCH(`/${ENDPOINT.ROOM}/${id}`, {}, {});
};

export const roomApi = { createRoom, getDataRoom, deleteRoom };
