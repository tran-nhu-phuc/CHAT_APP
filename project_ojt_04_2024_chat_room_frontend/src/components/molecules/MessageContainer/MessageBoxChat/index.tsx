import React, { memo } from 'react';
import Avatar from '../../../atoms/Avatar/Avatar';
import './index.scss';

import parse from 'html-react-parser';
import { MessageResponse } from '../../../../apis/messages/responses/message.response';
import { UserInRoomResponse } from '../../../../apis/user-in-room/responses/user-in-room.response';
import replaceUserIdWithNameOrAttribute from '../../../../common/tagname';
import TimeDisplay from '../../../atoms/Time';

interface Props {
  dataItem: MessageResponse;
  listUserByRoom: UserInRoomResponse[];
}
const MessageBoxChat: React.FC<Props> = (props: Props) => {
  return (
    <div className="message-box-chat__container">
      <div className="message-box-chat-avatar">
        {props.dataItem.user ? (
          <Avatar
            source={
              props.dataItem.user?.avatar
                ? props.dataItem.user?.avatar
                : 'https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg'
            }
            className={'message-box-chat-item-image'}
          />
        ) : (
          <span></span>
        )}
      </div>
      <div className="message-box-chat-content">
        {props.dataItem?.user ? (
          <span className="message-box-chat-content-user-name">
            {props.dataItem.user?.firstName + ' ' + props.dataItem.user?.lastName}
          </span>
        ) : null}
        <span className="message-box-chat-owner-content-item">
          {parse(replaceUserIdWithNameOrAttribute(props.dataItem?.content as string, props.listUserByRoom || []))}
        </span>
        <span className="message-box-chat-owner-content-time-item">
          <TimeDisplay timestamp={props.dataItem?.createdAt} />
        </span>
      </div>
    </div>
  );
};
export default memo(MessageBoxChat);
