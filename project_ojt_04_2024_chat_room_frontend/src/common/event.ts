export const EVENT = {
  EMIT: {
    CONNECTION: 'connection',
    CREATE_MESSAGE: 'createMessage',
    CREATE_ROOM: 'createRoom',
    JOINING_ROOM: 'joiningRoom',
    LEAVING_ROOM: 'leavingRoom',
    AVATAR: 'avatar',
    USER_CONNECTION: 'userConnection',
  },
  ON: {
    CONNECTED: 'connect',
    DISCONNECTION: 'disconnect',
    MESSAGES: 'roomChat',
    NOTICE: 'notification',
    JOINING_ROOM: 'joiningRoom',
    LEAVING_ROOM: 'leavingRoom',
    CHECK_JOIN_ROOM: 'checkJoinRoom',
    CHECK_LEAVE_ROOM: 'checkLeaveRoom',
    CHECK_UPDATE_ROOM: 'checkUpdateRoom',
    AVATAR_EVENT: 'avatarEvent',
  },
};
