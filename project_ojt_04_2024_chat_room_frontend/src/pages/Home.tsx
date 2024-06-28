/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useEffect } from 'react';
import SidebarList from '../components/organisms/SidebarList/SidebarList';
import { useDispatch } from 'react-redux';
import { MessageResponse } from '../apis/messages/responses/message.response';
import { incrementChangeEvent } from '../store/slices/messageEvent.slice';
import { joinRoom, leaveRoom } from '../store/slices/room.slice';
import { UserInRoomResponse } from '../apis/user-in-room/responses/user-in-room.response';
import { useSelector } from 'react-redux';
import { selectDataLogin } from '../store/slices/dataLogin.silce';
import { EVENT } from '../common/event';
import { newNotificationEvent } from '../store/slices/newNotification.slice';
import { check } from '../store/slices/checkJoniRoom.slice';
import { checkUpdateAvatar } from '../store/slices/checkUpdateAvatar.slice';
import { socketConfig } from '../sockets/socket.config';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const userLogin = useSelector(selectDataLogin);
  const dispatch = useDispatch();
  useEffect(() => {
    if (userLogin) {
      const socket = socketConfig.socket();
      const socketUser = socketConfig.socketUser();
      const socketRoom = socketConfig.socketRoom();
      socket.emit(EVENT.EMIT.CONNECTION, userLogin.id, (error: Error) => {
        console.log(error);
      });

      socketRoom.emit(EVENT.EMIT.CONNECTION, userLogin.id, (error: Error) => {
        console.log(error);
      });
      socket.emit(EVENT.EMIT.USER_CONNECTION, userLogin.id, (error: Error) => {
        console.log(error);
      });
      socket.on(EVENT.ON.CONNECTED, () => {
        console.log('Connected to server');
      });

      socketRoom.on(EVENT.ON.CONNECTED, () => {
        console.log('Connected to server');
      });

      socket.on(EVENT.ON.DISCONNECTION, () => {
        console.log('Disconnected from server');
      });

      socket.on(EVENT.ON.NOTICE, (data: any) => {
        if (data) {
          dispatch(newNotificationEvent(data));
        }
      });

      socket.on(EVENT.ON.MESSAGES, (newDataMessage: MessageResponse) => {
        dispatch(incrementChangeEvent(newDataMessage.message));
      });

      socket.on(EVENT.ON.JOINING_ROOM, (newDataJoiningRoom: UserInRoomResponse) => {
        dispatch(joinRoom(newDataJoiningRoom.data));
      });

      socket.on(EVENT.ON.LEAVING_ROOM, (newDataLeavingRoom: UserInRoomResponse) => {
        dispatch(leaveRoom(newDataLeavingRoom.data));
      });

      socketRoom.on(EVENT.ON.CHECK_JOIN_ROOM, (data: any) => {
        if (data.roomId) {
          if (data.membersId.includes(userLogin.id)) {
            dispatch(check());
            socket.emit(EVENT.EMIT.CONNECTION, userLogin.id, (error: any) => {
              console.log(error);
            });
          }
        }
      });

      socketRoom.on(EVENT.ON.CHECK_LEAVE_ROOM, (data: any) => {
        if (data.roomId) {
          if (data.membersId.includes(userLogin.id)) {
            dispatch(check());
            socket.emit(EVENT.EMIT.CONNECTION, userLogin.id, (error: any) => {
              console.log(error);
            });
          }
        }
      });

      socketRoom.on(EVENT.ON.CHECK_UPDATE_ROOM, (data: any) => {
        if (data === 'update') {
          dispatch(check());
        }
      });
      // socketRoom
      socketUser.on(EVENT.ON.AVATAR_EVENT, (data: any) => {
        dispatch(checkUpdateAvatar(data));
        console.log(data, 'upload');
      });
    }
  }, [userLogin]);

  return (
    <div className="default-layout__main__side-bar">
      <SidebarList />
    </div>
  );
};

export default memo(Home);
