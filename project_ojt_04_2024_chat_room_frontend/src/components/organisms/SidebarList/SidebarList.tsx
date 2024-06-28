import { memo, useEffect, useRef, useState } from 'react';
import './SidebarList.scss';
import Loading from '../../atoms/Loading';
import Search from '../../atoms/Search';
import { UserInRoomResponse } from '../../../apis/user-in-room/responses/user-in-room.response';
import { userInRoomService } from '../../../services/user-in-room.service';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { incrementChangeDataRoom } from '../../../store/slices/dataRoomByUser.slice';
import SidebarBox from '../../molecules/SidebarListRoomBox/SidebarBox';
import { AppState } from '../../../store';
import { selectCheckJointOutRoom } from '../../../store/slices/checkJoniRoom.slice';

const SidebarList = () => {
  const [pageRoom, setPageRoom] = useState<number>(1);
  const [dataListRoom, setDataListRoom] = useState<UserInRoomResponse[]>([]);
  const [loadingRoom, setLoadingRoom] = useState<boolean>(false);
  const [isEnoughDataRoom, setIsEnoughDataRoom] = useState<boolean>(true);
  const [dataSearchRoom, setDataSearchRoom] = useState<string>('');
  const [fetchRoomsTrigger, setFetchRoomsTrigger] = useState<boolean>(true);
  const [prevDataSearchRoom, setPrevDataSearchRoom] = useState<string>('');
  const newEventDataMessage = useSelector((state: AppState) => state.messageEventSlice);
  const memoryRoomId = useRef<number | undefined>(undefined);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeRoom, setActiveRoom] = useState<number>();
  const checkJoinOutRoom = useSelector(selectCheckJointOutRoom);

  const handleClickRoom = (roomItem: UserInRoomResponse): void => {
    setActiveRoom(roomItem.roomId);
    if (Number(memoryRoomId.current) === Number(roomItem.roomId)) {
      return;
    }

    navigate(`/?room=${roomItem.roomId}`);
  };
  useEffect(() => {
    if (dataListRoom.length > 0) {
      dispatch(incrementChangeDataRoom(dataListRoom));
    }
  }, [dataListRoom]);

  const handelGetDataSearchRoom = (dataSearch: string): void => {
    setPageRoom(1);

    setIsEnoughDataRoom(true);

    setFetchRoomsTrigger(true);

    setDataSearchRoom(dataSearch);
  };

  const handlePageRoom = (): void => {
    setFetchRoomsTrigger(true);
    setPageRoom((prevPageRoom) => prevPageRoom + 1);
  };

  const fetchRoomsByUser = async (pageOfRoom: number): Promise<void> => {
    setLoadingRoom(true);
    try {
      const urlEndpoint = `?page=${pageOfRoom}&limit=20&search=${dataSearchRoom}`;

      const result = await userInRoomService.listRoomByUserApi(urlEndpoint);

      const fetchedData = result?.data;

      if (dataSearchRoom === '' && isEnoughDataRoom) {
        setDataListRoom((prevDataListRoom: UserInRoomResponse[]) => {
          if (dataListRoom?.length > 0 && prevDataSearchRoom === '' && pageOfRoom > 1) {
            return [...prevDataListRoom, ...fetchedData];
          } else {
            return fetchedData;
          }
        });

        setIsEnoughDataRoom(result?.data.length === 20);

        setPrevDataSearchRoom('');
      } else {
        setDataListRoom((prevDataListRoom: UserInRoomResponse[]) => {
          if (pageOfRoom > 1 && prevDataSearchRoom === dataSearchRoom && isEnoughDataRoom) {
            return [...prevDataListRoom, ...fetchedData];
          } else {
            return fetchedData;
          }
        });

        setIsEnoughDataRoom(result?.data.length === 20);

        setPrevDataSearchRoom(dataSearchRoom);
      }

      setLoadingRoom(false);
    } catch (error) {
      setLoadingRoom(false);

      console.error('Error fetching rooms:', error);
    }
  };

  useEffect(() => {
    fetchRoomsByUser(1);
  }, [checkJoinOutRoom]);

  useEffect(() => {
    const shouldFetchRooms =
      (fetchRoomsTrigger && dataSearchRoom === '' && isEnoughDataRoom) ||
      (fetchRoomsTrigger && dataSearchRoom !== '' && isEnoughDataRoom);
    if (shouldFetchRooms) {
      fetchRoomsByUser(pageRoom);

      setFetchRoomsTrigger(false);
    }
  }, [pageRoom, dataSearchRoom]);

  useEffect(() => {
    if (dataListRoom.length > 0) {
      dispatch(incrementChangeDataRoom(dataListRoom));
    }
  }, [dataListRoom]);

  useEffect(() => {
    if (newEventDataMessage.state) {
      setDataListRoom([]);
      fetchRoomsByUser(1);
    }
  }, [newEventDataMessage.status]);

  useEffect(() => {
    const container = document.querySelector('.sidebar-list__container');

    if (!container) return;

    const handleScroll = () => {
      const maxScroll = container.scrollHeight - container.clientHeight;

      const currentPosition = maxScroll - container.scrollTop;

      if (Math.round(currentPosition) === 0) {
        handlePageRoom();
      }
    };
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);
  useEffect(() => {
    if (dataListRoom.length > 0) {
      dispatch(incrementChangeDataRoom(dataListRoom));
    }
  }, [dataListRoom]);

  return (
    <div className="sidebar-list__container">
      <Search handelGetDataSearchRoom={handelGetDataSearchRoom} />
      {dataListRoom.map((item: UserInRoomResponse) => {
        return (
          <div
            key={item.id}
            onClick={() => handleClickRoom(item)}
            className={`${Number(activeRoom) === Number(`${item.roomId}`) ? 'room--active' : ''}`}
          >
            <SidebarBox roomItem={item} />
          </div>
        );
      })}
      {loadingRoom ? (
        <div className="sidebar-list-loading-room">
          <Loading color="black" size={25} />
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default memo(SidebarList);
