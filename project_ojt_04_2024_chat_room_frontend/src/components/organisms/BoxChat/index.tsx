/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef, memo } from 'react';
import './index.scss';
import { MessageResponse } from '../../../apis/messages/responses/message.response';
import { UserInRoomResponse } from '../../../apis/user-in-room/responses/user-in-room.response';
import { useLocation, useNavigate } from 'react-router-dom';
import { userInRoomService } from '../../../services/user-in-room.service';
import { messageServices } from '../../../services/message.service';
import { useSelector } from 'react-redux';
import { selectDataLogin } from '../../../store/slices/dataLogin.silce';
import HeaderBoxChat from '../../molecules/MessageContainer/HeaderBoxChat';
import BodyBoxChat from '../../molecules/MessageContainer/BodyBoxChat';
import FooterBoxChat from '../../molecules/MessageContainer/FooterBoxChat';
import { AppState } from '../../../store';
import { selectCheckJointOutRoom } from '../../../store/slices/checkJoniRoom.slice';
import { formatName } from '../../../utilities/format.ulti';

const BoxChat = () => {
  const [filterListMessage, setFilterListMessage] = useState<MessageResponse[]>([]);
  const [dataListMessage, setDataListMessage] = useState<MessageResponse[]>([]);
  const [pageMessage, setPageMessage] = useState<number>(1);
  const [loadingMessage, setLoadingMessage] = useState<boolean>(false);
  const [isEnoughDataMessageDown, setIsEnoughDataMessageDown] = useState<boolean>(true);
  const [scrollDirection, setScrollDirection] = useState<string>('down');
  const [isEnoughDataMessageUp, setIsEnoughDataMessageUp] = useState<boolean>(true);
  const [fetchMessagesTrigger, setFetchMessagesTrigger] = useState<boolean>(true);
  const [listUserByRoom, setListUserByRoom] = useState<UserInRoomResponse[]>([]);
  const [footerHeight, setFooterHeight] = useState<number>(100);
  const [resetDataListMessage, setResetDataListMessage] = useState<boolean>(false);
  const [messageLatest, setMessageLatest] = useState<boolean>(false);
  const [limitUserByRoom] = useState<number>(10000000);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const messageId = Number(queryParams.get('message'));
  const memoryMessageId = useRef<number | null>(messageId);
  const roomId = Number(queryParams.get('room'));
  const newEventDataMessage = useSelector((state: AppState) => state.messageEventSlice);
  const userLogin = useSelector(selectDataLogin);
  const footerRef = useRef<HTMLDivElement>(null);
  const memoryRoomId = useRef<number | null>(roomId);
  const navigate = useNavigate();
  const lastCall = useRef<number>(0);
  const update = useSelector(selectCheckJointOutRoom);
  const [listMembers, setListMembers] = useState<UserInRoomResponse[]>([]);

  const handlePageMessage = (scrollTo: string): void => {
    const throttleDelay = 500;

    const now = new Date().getTime();

    if (now - lastCall.current < throttleDelay) return;

    lastCall.current = now;

    setFetchMessagesTrigger(true);

    setScrollDirection(scrollTo);

    setPageMessage((prevPageMessage) => prevPageMessage + 1);
  };

  const fetchUsersByRoom = async (roomItem: number): Promise<void> => {
    try {
      const urlEndpoint = `${roomItem}/?limit=${limitUserByRoom}`;

      const result = await userInRoomService.listUsersByRoom(urlEndpoint);
      const members: any = [];
      result?.data?.forEach((item: UserInRoomResponse) => {
        members.push({
          id: item.user.id,
          name: formatName(item.user.firstName, item.user.lastName),
        });
      });
      setListMembers(members);
      setListUserByRoom([...result?.data]);
    } catch (error) {
      throw error;
    }
  };

  const fetchMessages = async (lastMessageId: number | null = null): Promise<void> => {
    setLoadingMessage(true);
    try {
      const directionParam = scrollDirection === 'down' ? 'down=1' : 'up=1';

      let urlEndpoint = `${roomId}/?${directionParam}`;

      if (lastMessageId) {
        urlEndpoint += `&messageId=${lastMessageId}`;
      }
      if (!roomId || !fetchMessagesTrigger) {
        setLoadingMessage(false);
        return;
      }

      const result = await messageServices.findMessageByRoom(urlEndpoint);

      setDataListMessage(() => {
        if (lastMessageId && dataListMessage.length > 0) {
          if (scrollDirection === 'down') {
            setIsEnoughDataMessageDown(result.length === 20);

            return [...result.slice(0, -1), ...dataListMessage];
          } else {
            setIsEnoughDataMessageUp(result.length > 1);

            return [...dataListMessage, ...result.reverse().slice(1)];
          }
        } else {
          setIsEnoughDataMessageDown(result.length === 20);

          setMessageLatest(!messageLatest);

          return [...result];
        }
      });

      setLoadingMessage(false);
    } catch (error) {
      setLoadingMessage(false);

      console.error('Error fetching messages:', error);

      throw error;
    }
  };

  useEffect(() => {
    const secretNotice = location.pathname.split('/')[1] === 'notification';
    if (!isEnoughDataMessageUp) {
      setDataListMessage(() => [...dataListMessage, newEventDataMessage?.state]);
    } else if (newEventDataMessage?.state && isEnoughDataMessageUp && secretNotice && messageId && roomId) {
      navigate(`/notification/?room=${roomId}`);
    }
  }, [newEventDataMessage?.status]);

  useEffect(() => {
    fetchUsersByRoom(roomId);
  }, [roomId, update]);

  useEffect(() => {
    const handleFetchApiMessage = () => {
      if (roomId && fetchMessagesTrigger) {
        if (dataListMessage.length > 0) {
          if (scrollDirection === 'down' && isEnoughDataMessageDown) {
            fetchMessages(dataListMessage[0]?.id);

            setFetchMessagesTrigger(false);
          } else if (scrollDirection === 'up' && isEnoughDataMessageUp) {
            fetchMessages(dataListMessage[dataListMessage.length - 1]?.id);

            setFetchMessagesTrigger(false);
          }
        } else {
          if (messageId) {
            if (scrollDirection === 'down') {
              fetchMessages(messageId);

              setFetchMessagesTrigger(false);
            } else if (scrollDirection === 'up') {
              fetchMessages(messageId);

              setFetchMessagesTrigger(false);
            }
          } else {
            setIsEnoughDataMessageUp(false);

            fetchMessages();

            setFetchMessagesTrigger(false);
          }
        }
      }

      setFetchMessagesTrigger(false);
    };

    handleFetchApiMessage();
  }, [pageMessage, resetDataListMessage]);

  useEffect(() => {
    if (roomId !== memoryRoomId.current || messageId !== memoryMessageId.current) {
      handelResetFetMessage();
    }
  }, [location]);

  useEffect(() => {
    setFilterListMessage([...mapMessages(dataListMessage)]);
  }, [dataListMessage]);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentBoxSize) {
          const height = entry.contentBoxSize[0].blockSize;

          handleFooterHeightChange(height);
        } else {
          const height = entry.contentRect.height;

          handleFooterHeightChange(height);
        }
      }
    });

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  const mapMessages = (listMessages: MessageResponse[]): MessageResponse[] => {
    let previousUserId: number | null | undefined = null;

    return listMessages?.map((message: MessageResponse) => {
      const shouldRenderUser = message?.userId !== previousUserId;

      previousUserId = message?.userId;

      return {
        id: message?.id,
        content: message?.content,
        isDelete: message?.isDelete,
        userId: message?.userId,
        user: shouldRenderUser ? { ...message?.user } : null,
        roomId: message?.roomId,
        createdAt: message?.createdAt,
        updatedAt: message?.updatedAt,
      };
    });
  };

  const handleFooterHeightChange = (newHeight: number): void => {
    setFooterHeight(newHeight);
  };

  const handelResetFetMessage = () => {
    setDataListMessage([]);

    memoryRoomId.current = roomId;

    memoryMessageId.current = messageId;

    setFetchMessagesTrigger(true);

    setScrollDirection('down');

    setIsEnoughDataMessageDown(true);

    setIsEnoughDataMessageUp(true);

    setResetDataListMessage(!resetDataListMessage);
  };

  return (
    <div className="box-chat-main__container">
      <div className="box-chat-main-header">
        <HeaderBoxChat listUserByRoom={listUserByRoom} listMembers={listMembers} />
      </div>
      <div
        className="box-chat-main-body"
        style={{ maxHeight: `calc(100vh - 100px - ${footerHeight}px)`, overflowY: 'auto' }}
      >
        <BodyBoxChat
          listUserByRoom={listUserByRoom.filter((item: UserInRoomResponse) => item.userId != userLogin.id)}
          dataListMessage={filterListMessage}
          handlePageMessage={handlePageMessage}
          loadingMessage={loadingMessage}
          isEnoughDataMessageUp={isEnoughDataMessageUp}
          isEnoughDataMessageDown={isEnoughDataMessageDown}
          messageLatest={messageLatest}
        />
      </div>
      <div className="box-chat-main-footer" ref={footerRef}>
        <FooterBoxChat
          listUserByRoom={listUserByRoom.filter((item: UserInRoomResponse) => item.userId != userLogin.id)}
        />
      </div>
    </div>
  );
};

export default memo(BoxChat);
