export const ENDPOINT = {
  // auth endpoint
  LOGIN: `auth/login`,
  REGISTER: `auth/register`,
  CHECK_LOGIN: `auth/check-login`,
  // room endpoint
  ROOMS: {
    BASE: 'api/v1/rooms',
  },
  //message endpoint
  MESSAGES: {
    BASE: 'api/v1/messages',
  },
  //user endpoint
  GET_PROFILE: `/api/v1/users`,
  UPDATE_AVATAR: `/api/v1/users/edit-profile`,
  UPLOAD_AVATAR: `/upload/upload-avatar`,
  //user in room endpoint
  USER_IN_ROOM: {
    BASE: 'api/v1/user-in-rooms',
    BY_ROOM: 'by-room',
    BY_USER: 'by-user',
  },
  // notification endpoint
  NOTIFICATION: 'notification',

  SOCKET: {
    ERROR: 'error',
    CONNECTION: 'connection',
    DISCONNECTION: 'disConnection',
    // auth endpoint
    LOGIN: `/auth/login`,
    REGISTER: `/auth/register`,
    //user endPoint
    CREATE_MESSAGE: 'createMessage',
    MESSAGES: 'roomChat',
    NOTICE: 'notification',
    JOINING_ROOM: 'joiningRoom',
    LEAVING_ROOM: 'leavingRoom',
  },
};
