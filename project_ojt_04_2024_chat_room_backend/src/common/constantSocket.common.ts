/**
 * Constants for emit and on socket
 *
 * @key
 * @value - string
 */
export const CONSTANT_SOCKET = {
  CHECK_JOIN_ROOM: 'checkJoinRoom',
  CHECK_LEAVE_ROOM: 'checkLeaveRoom',
  CREATE_ROOM: 'createRoom',
  ADD_MEMBERS: 'addMembers',
  EDIT_ROOM: 'editRoom',
  REMOVE_MEMBERS: 'removeMembers',
  CHECK_UPDATE_ROOM: 'checkUpdateRoom',
  ERROR_DISCONNECT: 'errorDisconnect',
  ERROR_AUTH: 'errorAuth',
};

/**
 * Constants for namespace of websocket
 *
 * @key
 * @value - string
 */
export const CONSTANT_SOCKET_PATH = {
  USER_IN_ROOM: 'user-in-room',
  ROOM: 'room',
};
