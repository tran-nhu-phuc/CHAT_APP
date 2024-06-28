/* eslint-disable @typescript-eslint/no-explicit-any */
import Avatar from '../../../atoms/Avatar/Avatar';
import './index.scss';
import { CiUser } from 'react-icons/ci';
import { TbUsersPlus } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import { UserInRoomResponse } from '../../../../apis/user-in-room/responses/user-in-room.response';
import { memo, useEffect, useState } from 'react';
import { AppState } from '../../../../store';
import EditMembers from '../../../organisms/editMembers/EditMembers';
import { useLocation } from 'react-router-dom';
import { formatName } from '../../../../utilities/format.ulti';
interface Props {
  listUserByRoom: UserInRoomResponse[];
  listMembers: any[];
}
const HeaderBoxChat: React.FC<Props> = (props: Props) => {
  const dataListRoom = useSelector((state: AppState) => state.dataRoomByUserSlice.data);
  const [roomItem, setRoomItem] = useState<UserInRoomResponse>();
  const [isAddMember, setIsAddMember] = useState<boolean>(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roomId = Number(queryParams.get('room'));

  const handelCheckRoom = (roomI: number) => {
    setRoomItem(() => {
      return dataListRoom.find((item: UserInRoomResponse) => {
        return item.roomId === roomI;
      });
    });
  };

  useEffect(() => {
    if (dataListRoom) {
      handelCheckRoom(roomId);
    }
  }, [roomId]);

  const handleAddMembers = () => {
    setIsAddMember(true);
  };

  const offEditMember = () => {
    setIsAddMember(false);
  };

  useEffect(() => {
    if (dataListRoom) {
      handelCheckRoom(roomId);
    }
  }, [roomId]);
  return (
    <div className="header-box-chat__container">
      <div className="header-hox-chat-avatar">
        <Avatar source="https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745" />
      </div>
      <div className="header-hox-chat-name">
        <div>
          <strong>{roomItem?.room?.name}</strong>
        </div>
        <div className="header-hox-chat-name-list-member">
          <span className="header-hox-chat-name-list-member-count-member">
            <CiUser /> <span>{props.listUserByRoom?.length} member</span>
          </span>
          <div className="header-hox-chat-name-list-member-box">
            {props.listUserByRoom?.map((item: UserInRoomResponse) => {
              return (
                <div key={item.id} className="header-hox-chat-name-list-member-box-item">
                  <Avatar
                    source={
                      item.user.avatar
                        ? item.user.avatar
                        : 'https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg'
                    }
                    className={'header-hox-chat-name-list-member-box-item-avatar'}
                  />
                  <span>{formatName(item.user?.firstName, item.user?.lastName)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="header-hox-chat-add-member">
        <TbUsersPlus onClick={() => handleAddMembers()} className="header-hox-chat-add-member-icon" />
      </div>
      {isAddMember && (
        <EditMembers
          type={'addMember'}
          offEditMember={offEditMember}
          listMembers={props.listMembers}
          roomEdit={roomItem?.room}
        />
      )}
    </div>
  );
};

export default memo(HeaderBoxChat);
