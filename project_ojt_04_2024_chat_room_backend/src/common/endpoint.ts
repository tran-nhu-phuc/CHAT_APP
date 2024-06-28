export const ENDPOINT = {
  // notification endpoint
  NOTIFICATION: 'notification',
  // auth endpoint
  AUTH: '/auth',
  LOGIN: `/login`,
  REGISTER: `/register`,
  CHECK_LOGIN: `check-login`,
  // room endpoint
  ROOMS: {
    BASE: 'api/v1/rooms',
  },
  //message endpoint
  MESSAGES: {
    BASE: 'api/v1/messages',
  },
  //user in room endpoint
  USER_IN_ROOM: {
    BASE: 'api/v1/user-in-rooms',
    BY_ROOM: 'by-room',
    BY_USER: 'by-user',
  },

  SOCKET: {
    ERROR: 'error',
    CONNECTION: 'connection',
    CREATE_MESSAGE: 'createMessage',
    MESSAGES: 'roomChat',
    NOTICE: 'notification',
    JOINING_ROOM: 'joiningRoom',
    LEAVING_ROOM: 'leavingRoom',
  },

  //user endpoint
  UPLOAD_AVATAR: `/upload/upload-avatar`,
  // user endpoint
  USER: 'users',
  // room endpoint
  ROOM: 'rooms',
};
