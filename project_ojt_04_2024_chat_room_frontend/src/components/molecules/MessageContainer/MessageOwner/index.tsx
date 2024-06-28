import { memo } from 'react';
import './index.scss';

import parse from 'html-react-parser';
import replaceUserIdWithNameOrAttribute from '../../../../common/tagname';
import TimeDisplay from '../../../atoms/Time';
import { UserInRoomResponse } from '../../../../apis/user-in-room/responses/user-in-room.response';
import { MessageResponse } from '../../../../apis/messages/responses/message.response';

interface Props {
  dataItem: MessageResponse;
  listUserByRoom: UserInRoomResponse[];
}

const MessageOwner: React.FC<Props> = (props: Props) => {
  return (
    <div className="message-box-chat-owner__container" id={`message_${props.dataItem?.id}`}>
      <div className="message-box-chat-owner-content">
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
export default memo(MessageOwner);
