import { io } from 'socket.io-client';
import { getAccessToken } from '../utilities/token.util';
const URL = 'http://127.0.0.1:8080';

const socket = () => {
  return io(URL, {
    extraHeaders: {
      Authorization: ('Bearer ' + getAccessToken()) as string,
    },
  });
};

const socketRoom = () => {
  return io(`${URL}/room`, {
    extraHeaders: {
      Authorization: ('Bearer ' + getAccessToken()) as string,
    },
  });
};

const socketUser = () => {
  return io(`${URL}/user`, {
    extraHeaders: {
      Authorization: ('Bearer ' + getAccessToken()) as string,
    },
  });
};

export const socketConfig = { socketRoom, socket, socketUser };
