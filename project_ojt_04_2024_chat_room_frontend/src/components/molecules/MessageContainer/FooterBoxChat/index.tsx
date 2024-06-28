/* eslint-disable @typescript-eslint/no-explicit-any */
// import { CiFaceSmile } from 'react-icons/ci';
import './index.scss';
import React, { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { UserInRoomResponse } from '../../../../apis/user-in-room/responses/user-in-room.response';
import { socketConfig } from '../../../../sockets/socket.config';
import { EVENT } from '../../../../common/event';
import ChatMessage from '../../../atoms/Chat';
import hasTextContent from '../../../../common/checkText';
import { IconBxsSend } from '../../../atoms/Icon/Icon';

interface Props {
  listUserByRoom: UserInRoomResponse[];
}
const FooterBoxChat: React.FC<Props> = (props: Props) => {
  const [message, setMessage] = useState<string>('');
  const [tagNameAll, setTagNameAll] = useState<(number | undefined)[]>([]);
  const userJoinRoom = useSelector((state: any) => state.roomSlice);
  console.log(userJoinRoom);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roomId = Number(queryParams.get('room'));

  const handelMessage = (messageItem: string) => {
    setMessage(messageItem);
  };

  const handelTagNameAll = () => {
    setTagNameAll(props.listUserByRoom.map((item: UserInRoomResponse) => item.userId));
  };
  const handleSendMessage = (): void => {
    try {
      if (message.trim() === '') {
        return;
      }

      const listTagName = [...handleCheckTagName()];

      const tagName = tagNameAll.length > 0 ? tagNameAll : listTagName;

      const roomUsers = userJoinRoom.rooms[roomId] || [];

      const resultTag: any[] = [];

      tagName.forEach((tag) => {
        const found = roomUsers.some((user: UserInRoomResponse) => Number(user) == Number(tag));

        resultTag.push({ userId: tag, status: found });
      });

      socketConfig.socket().emit(EVENT.EMIT.CREATE_MESSAGE, {
        roomId,
        content: message,
        tagName: resultTag.length > 0 ? resultTag : [],
      });

      const element = document.getElementsByClassName('ql-editor');

      element[0].innerHTML = '';

      setMessage('');

      setTagNameAll([]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckTagName = (): (string | number | null)[] => {
    return message
      .split('</span>')
      .map((item) => {
        const match = item.match(/@(\d+)/);
        return match ? parseInt(match[1]) : null;
      })
      .filter((item) => item !== null);
  };

  return (
    <div className="footer-box-chat__container">
      <div className="footer-box-chat-last-line-box-chat-message">
        <ChatMessage
          handelMessage={handelMessage}
          message={message}
          listUserByRoom={props.listUserByRoom}
          handelTagNameAll={handelTagNameAll}
          handleSendMessage={handleSendMessage}
        />
      </div>
      <div className="footer-box-chat-last-line-box-chat-button">
        {message.trim() !== '' && message !== '<br>' && hasTextContent(message) ? (
          <button>
            <IconBxsSend onClick={() => handleSendMessage()} />
          </button>
        ) : (
          <span></span>
        )}
      </div>
    </div>
  );
};
export default memo(FooterBoxChat);
