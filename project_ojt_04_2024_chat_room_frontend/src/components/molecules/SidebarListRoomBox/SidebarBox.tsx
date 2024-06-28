import { memo } from 'react';
import Avatar from '../../atoms/Avatar/Avatar';
import './SidebarBox.scss';
import TimeDisplay from '../../atoms/Time';
import replaceUserIdWithNameOrAttribute from '../../../common/tagname';
import { UserInRoomResponse } from '../../../apis/user-in-room/responses/user-in-room.response';
import parse from 'html-react-parser';

interface Props {
  roomItem: UserInRoomResponse;
}
const SidebarBox: React.FC<Props> = (props: Props) => {
  return (
    <div className="sidebar-box__container active">
      <div className="avatar">
        <Avatar source={'https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745'} />
      </div>
      <div className="sidebar-box__content">
        <div className="user-and-time">
          <div className="user">
            <p className={false ? 'user-notification' : 'user-room-name-box-chat'}>
              <strong>{props.roomItem?.room?.name}</strong>
            </p>
          </div>
          <div className="time">
            <p>
              <TimeDisplay timestamp={props.roomItem?.room?.updatedAt} />
            </p>
          </div>
        </div>
        <div className="message-and-state">
          <div className="message">
            <p>
              {parse(
                replaceUserIdWithNameOrAttribute(props.roomItem?.room?.lastMessage?.content.slice(0, 200) || '', []),
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(SidebarBox);
