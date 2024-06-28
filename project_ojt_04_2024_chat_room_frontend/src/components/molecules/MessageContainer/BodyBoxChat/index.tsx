/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useEffect, useRef, useState } from 'react';
import MessageBoxChat from '../MessageBoxChat';
import MessageOwner from '../MessageOwner';
import './index.scss';
import { UserInRoomResponse } from '../../../../apis/user-in-room/responses/user-in-room.response';
import { MessageResponse } from '../../../../apis/messages/responses/message.response';
import { useSelector } from 'react-redux';
import { selectDataLogin } from '../../../../store/slices/dataLogin.silce';
import Loading from '../../../atoms/Loading';
import { AppState } from '../../../../store';
import ChatPlaceholder from '../../../atoms/ChatPlaceholder';
import { MdKeyboardDoubleArrowDown } from 'react-icons/md';

interface Props {
  listUserByRoom: UserInRoomResponse[];
  dataListMessage: MessageResponse[];
  handlePageMessage: Function;
  loadingMessage: boolean;
  isEnoughDataMessageUp: boolean;
  messageLatest: boolean;
  isEnoughDataMessageDown: boolean;
}

const BodyBoxChat: React.FC<Props> = (props: Props) => {
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [isAtTop, setIsAtTop] = useState<boolean>(true);
  const messageLatest: any = useRef(null);
  const [isToMessageLatest, setIsToMessageLatest] = useState<boolean>(false);
  const userLogin = useSelector(selectDataLogin);
  const eventMessage = useSelector((state: AppState) => state.messageEventSlice);
  const [isMessageLatest, setIsMessageLatest] = useState<boolean>(false);

  useEffect(() => {
    const container = document.querySelector('.box-chat-main-body');

    if (!container) return;

    const handleScroll = () => {
      const maxScroll = container.scrollHeight - container.clientHeight;

      const currentPosition = maxScroll - container.scrollTop;

      setScrollPosition(Math.round(currentPosition));

      if (container.scrollTop < 1) {
        props.handlePageMessage('down');
      } else if (currentPosition < 1) {
        props.handlePageMessage('up');
        setIsMessageLatest(false);
      }
    };

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (scrollPosition < 50) {
      setIsAtTop(false);
    } else {
      setIsAtTop(true);
    }
  }, [scrollPosition]);

  const handelScrollTo = () => {
    if (messageLatest.current) {
      messageLatest.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    if (!props.isEnoughDataMessageUp) {
      if (scrollPosition <= 300 || eventMessage.state.userId == userLogin.id) {
        setTimeout(() => {
          handelScrollTo();
        }, 500);
      } else if (scrollPosition > 300) {
        if (eventMessage.state.userId !== userLogin.id) {
          setIsMessageLatest(true);
        }
      }
    }
  }, [eventMessage.status]);

  useEffect(() => {
    setTimeout(() => {
      handelScrollTo();
    }, 300);
  }, [isToMessageLatest, props.messageLatest]);

  return (
    <div className="body-box-chat__container">
      {!props.isEnoughDataMessageDown ? (
        <div className="body-box-chat-data-default">
          <ChatPlaceholder />
        </div>
      ) : (
        <span></span>
      )}
      {props.loadingMessage ? (
        <div className="body-box-chat-loading">
          <Loading color="black" size={25} className="body-box-chat-loading-message" />
        </div>
      ) : (
        <span></span>
      )}
      {props.dataListMessage.length > 0 ? (
        <div className="body-box-chat-list-message">
          {props.dataListMessage.map((item: MessageResponse) => {
            return item.userId == userLogin?.id ? (
              <div key={item.id} id={`message_${item?.id}`}>
                <MessageOwner dataItem={item} listUserByRoom={props.listUserByRoom} />
              </div>
            ) : (
              <div key={item.id} id={`message_${item?.id}`}>
                <MessageBoxChat dataItem={item} listUserByRoom={props.listUserByRoom} />
              </div>
            );
          })}
          {isAtTop ? (
            <button className="body-box-chat-arrow-down" onClick={() => setIsToMessageLatest(!isToMessageLatest)}>
              <MdKeyboardDoubleArrowDown />
              {isMessageLatest ? (
                <span className="body-box-chat-get-message-latest">Có tin nhắn mới</span>
              ) : (
                <span></span>
              )}
            </button>
          ) : (
            <span></span>
          )}
          <span className="body-box-chat-list-message-latest" ref={messageLatest}></span>
        </div>
      ) : (
        <span></span>
      )}
    </div>
  );
};
export default memo(BodyBoxChat);
