/* eslint-disable @typescript-eslint/no-explicit-any */
import { roomApi } from '../apis/rooms';
import { socketConfig } from '../sockets/socket.config';
import { IDataCreateRoom } from '../types/dataCreateRoom.type';
import { IERoom } from '../types/errorsRoom.type';
import { validateRoomName } from '../utilities/validate.ulti';
/**
 * Handle errors when creating
 * @param formData
 * @param errors
 * @returns errors
 */
const validateFormRoom = async (formData: IDataCreateRoom[]) => {
  const errors: IERoom[] = [];
  formData.forEach((item: IDataCreateRoom) => {
    const isValid = validateRoomName(String(item.name));
    if (!isValid && Number(item.members?.length) >= 2) {
      errors.push({ id: item.id, name: false, members: true });
    } else if (isValid && Number(item.members?.length) < 2) {
      errors.push({ id: item.id, name: true, members: false });
    } else if (Number(item.members?.length) < 2 && !isValid) {
      errors.push({ id: item.id, name: false, members: false });
    } else if (Number(item.members?.length) >= 2 && isValid) {
      errors.push({ id: item.id, name: true, members: true });
    }
  });

  const newErrors = errors.filter((err: IERoom) => err.name === false || err.members === false);
  return newErrors;
};

const createRoom = async (formData: IDataCreateRoom[]) => {
  const socket = socketConfig.socketRoom();
  const newFormData = formData.map((item: IDataCreateRoom) => {
    return {
      name: item.name,
      membersId: item.members?.map((item: any) => item.id),
    };
  });
  try {
    socket.emit('createRoom', newFormData);
  } catch (error) {
    console.log(error);
  }
};

const editRoom = async (formData: IDataCreateRoom[], oldMembers: IDataCreateRoom[], roomEdit?: any) => {
  const socket = socketConfig.socketRoom();

  const newFormData = formData[0].members;
  const result: any[] = [];
  newFormData?.forEach((item: any) => {
    const check = oldMembers.find((element: any) => item.id === element.id);
    if (!check) {
      result.push({ ...item, status: 'add' });
    }
  });
  oldMembers.forEach((item: any) => {
    const check = newFormData?.find((element: any) => item.id === element.id);
    if (!check) {
      result.push({ ...item, status: 'remove' });
    }
  });

  const dataEdit = {
    roomId: roomEdit ? roomEdit.id : formData[0].id,
    name: roomEdit ? (roomEdit.name === formData[0].name ? undefined : formData[0].name) : undefined,
    members: result,
  };
  console.log(dataEdit, 'dateEdit');

  try {
    socket.emit('editRoom', dataEdit);
  } catch (error) {
    console.log(error);
  }
};

const getDataRoom = async (limit: number) => {
  try {
    return await roomApi.getDataRoom(limit);
  } catch (error) {
    throw error;
  }
};

const deleteRoom = async (id: number) => {
  try {
    return await roomApi.deleteRoom(id);
  } catch (error) {
    throw error;
  }
};

export const roomService = { createRoom, validateFormRoom, getDataRoom, editRoom, deleteRoom };
