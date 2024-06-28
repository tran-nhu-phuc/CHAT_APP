import { useLocation } from 'react-router-dom';
import BoxChat from '../organisms/BoxChat';
import SubMenu from '../organisms/SubMenu/SubMenu';
import './DefaultLayout.scss';
import { ReactNode, memo, useEffect, useRef } from 'react';
import NoDataImage from '../atoms/NoData';
import { FaChevronRight } from 'react-icons/fa';
import { socketConfig } from '../../sockets/socket.config';
import { useSelector } from 'react-redux';
import { selectDataLogin } from '../../store/slices/dataLogin.silce';
import { EVENT } from '../../common/event';

const DefaultLayout = (props: { children: ReactNode }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roomId = Number(queryParams.get('room'));
  const userLogin = useSelector(selectDataLogin);
  const memoryRoomId = useRef<number | null>(null);

  useEffect(() => {
    if (roomId) {
      const socket = socketConfig.socket();

      if (memoryRoomId.current != roomId) {
        socket.emit(EVENT.EMIT.LEAVING_ROOM, { roomId: memoryRoomId.current, userId: userLogin.id });
      }

      memoryRoomId.current = roomId;

      socket.emit(EVENT.EMIT.JOINING_ROOM, { roomId: roomId, userId: userLogin.id });
    }
  }, [roomId]);

  return (
    <div className="default-layout">
      <div className="default-layout__sub-menu">
        <SubMenu />
      </div>
      <div className="default-layout__main">
        {props.children}
        <div className="default-layout__main__content">{roomId ? <BoxChat /> : <NoDataImage />}</div>
      </div>
      <div className="default-layout-cherRonRight">
        <FaChevronRight />
      </div>
    </div>
  );
};

export default memo(DefaultLayout);
