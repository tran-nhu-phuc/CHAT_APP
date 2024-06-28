import Avatar from '../../atoms/Avatar/Avatar';
import './index.scss';
import { notificationService } from '../../../services/notification.service';
import { NotificationIntf } from '../../../types/entities.type';
import { useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';
import { memo } from 'react';
import TimeDisplay from '../../atoms/Time';
import { useSelector } from 'react-redux';
import { AppState } from '../../../store';
import replaceUserIdWithNameOrAttribute from '../../../common/tagname';

interface Props {
  notificationItem: NotificationIntf;
}
const NotificationBox = (props: Props) => {
  const navigate = useNavigate();
  const userList = useSelector((state: AppState) => state.userInRoomSlice);

  const handleAfterClickNotification = async (notificationId: number, roomId: number, messageId: number) => {
    if (notificationId == props.notificationItem.id) {
      props.notificationItem.status = 1;
    }
    navigate(`/notification/?room=${roomId}&message=${messageId}`);
    await notificationService.updateNotificationStatus(notificationId);
  };
  return (
    <>
      <div
        key={props.notificationItem.id}
        className="sidebar-box__container"
        style={{
          opacity: props.notificationItem.status === 1 ? '0.3' : 1,
        }}
        onClick={() =>
          handleAfterClickNotification(
            props.notificationItem.id,
            props.notificationItem.message.roomId,
            props.notificationItem.messageId,
          )
        }
      >
        <div className="avatar">
          <Avatar source={props.notificationItem.message.user.avatar} />
        </div>
        <div className="sidebar-box__content">
          <div className="user-and-time">
            <div className="user">
              <p>
                <b>{props.notificationItem.message.user.firstName}</b> đã đề cập bạn trong{' '}
                <b>{props.notificationItem.message.rooms.name}</b>.
              </p>
            </div>
            <div className="time">
              <p>
                <TimeDisplay timestamp={props.notificationItem.createdAt} />
              </p>
            </div>
          </div>
          <div className="message-and-state">
            <div className="message">
              {parse(replaceUserIdWithNameOrAttribute(props.notificationItem.message.content as string, userList))}
            </div>
            <div className={props.notificationItem.status === 0 ? 'not-seen' : 'seen'}></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(NotificationBox);
