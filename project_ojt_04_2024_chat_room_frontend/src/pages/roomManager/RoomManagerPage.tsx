/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import styles from './RoomManagerPage.module.scss';
import { roomService } from '../../services/room.service';
import CreateRoomTemplate from '../../components/templates/createRoom/CreateRoom';
import { formatDate, formatName, truncateString } from '../../utilities/format.ulti';

import { useSelector } from 'react-redux';
// import { selectUpdateListRoom } from '../../store/slices/updateListRoom.slice';
import { selectCheckJointOutRoom } from '../../store/slices/checkJoniRoom.slice';
import Loading from '../../components/atoms/Loading';

const ListRoom: React.FC = () => {
  const [roomData, setRoomData] = useState<any[]>([]);
  const [openPopupId, setOpenPopupId] = useState<number | null>(null);
  const [isModal, setIsModal] = useState<boolean>(false);
  const [roomEdit, setRoomEdit] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [limitRoom, setLimitRoom] = useState<number>(20);
  const [isEnoughDataRoom, setIsEnoughDataRoom] = useState<boolean>(true);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const updateListRoom = useSelector(selectCheckJointOutRoom);
  // Get data for edit room
  const fetchRoomData = async () => {
    setIsLoading(true);
    try {
      const rooms: any = await roomService.getDataRoom(limitRoom);
      setRoomData(rooms.data);
      setIsEnoughDataRoom(rooms.data.length === limitRoom);
    } catch (error) {
      console.error('Error fetching room data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (isEnoughDataRoom) {
      fetchRoomData();
    }
  }, [limitRoom]);

  useEffect(() => {
    fetchRoomData();
  }, [updateListRoom]);

  useEffect(() => {
    const tableBody = document.querySelector(`.${styles.roomTable} tbody`);
    if (!tableBody) return;
    const handleScroll = async () => {
      const maxScroll = tableBody.scrollHeight - tableBody.clientHeight;
      const currentPosition = maxScroll - tableBody.scrollTop;
      if (currentPosition < 10 && isEnoughDataRoom) {
        setLimitRoom((prevLimit) => prevLimit + 20);
      }
    };
    tableBody.addEventListener('scroll', handleScroll);
    return () => {
      tableBody.removeEventListener('scroll', handleScroll);
    };
  }, [roomData, isEnoughDataRoom]);

  const openPopup = (roomId: number, memberCount: number) => {
    if (memberCount > 0) {
      setOpenPopupId(roomId);
    }
  };

  const closePopup = () => {
    setOpenPopupId(null);
  };

  const handlePopupClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
  };

  const handleOutsideClick = () => {
    if (openPopupId !== null) {
      closePopup();
    }
  };

  const handleIsEdit = (room: any) => {
    setIsModal(true);
    setRoomEdit(room);
  };

  useEffect(() => {
    if (openPopupId !== null) {
      const button = document.querySelector(`[data-room-id="${openPopupId}"]`) as HTMLButtonElement;
      const popup = popupRef.current;
      const table = document.querySelector(`.${styles.roomTable}`) as HTMLTableElement;
      if (button && popup && table) {
        const rect = button.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const popupHeight = popup.offsetHeight;
        const spaceBelow = viewportHeight - rect.bottom - table.getBoundingClientRect().top;
        if (popupHeight < spaceBelow) {
          popup.classList.add(styles.popupAbove);
        } else {
          popup.classList.remove(styles.popupAbove);
        }
      }
    }
  }, [openPopupId, roomData]);

  // Soft delete room
  const handleDeleteRoom = async (id: number) => {
    if (confirm('Delete this room?')) {
      try {
        const result = await roomService.deleteRoom(id);
        if (result?.status === 200) {
          fetchRoomData();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const offModal = () => {
    setIsModal(false);
    setRoomEdit(null);
  };
  return (
    <div className={styles.listRoomContainer} onClick={handleOutsideClick}>
      <h2 className={styles.tableTitle}>Màn hình danh sách room</h2>
      <button onClick={() => setIsModal(true)} className={styles.addButton}>
        Add
      </button>
      {roomData.length === 0 ? (
        <p>Không tồn tại room.</p>
      ) : (
        <table className={styles.roomTable}>
          <thead>
            <tr>
              <th>Room name</th>
              <th>List member</th>
              <th>Người tạo</th>
              <th>Ngày tạo</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5}>
                  <Loading color="#36D7B7" size={50} className={styles.loading} />
                </td>
              </tr>
            )}
            {roomData.length > 0 &&
              roomData.map((room: any, index: number) => (
                <tr key={index}>
                  <td>{room.name}</td>
                  <td className={styles.listMember}>
                    <div className={styles.popupContainer}>
                      <button
                        data-room-id={room.id}
                        className={styles.memberButton}
                        onClick={() => openPopup(room.id, room.userInRoom.length)}
                      >
                        {room.userInRoom.length} members
                      </button>
                      {openPopupId === room.id && (
                        <div
                          ref={popupRef}
                          className={`${styles.popup} ${styles.popupVisible}`}
                          onClick={handlePopupClick}
                        >
                          <div className={styles.popupContent}>
                            {room.userInRoom.map((member: any, memberId: number) => (
                              <div className={styles.memberInfo} key={memberId}>
                                <img src={member.user.avatar} alt="Avatar" />
                                <div className={styles.memberName}>
                                  {truncateString(formatName(member.user.firstName, member.user.lastName), 15)}
                                  {member.user.firstName.length > 15 && (
                                    <span className={styles.tooltip}>
                                      {formatName(member.user.firstName, member.user.lastName)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{formatName(room.creator.firstName, room.creator.lastName)}</td>
                  <td>{formatDate(room.createdAt)}</td>
                  <td>
                    <button onClick={() => handleIsEdit(room)} className={styles.editButton}>
                      edit
                    </button>
                    <button onClick={() => handleDeleteRoom(room.id)} className={styles.deleteButton}>
                      xóa
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
      {isModal && <CreateRoomTemplate roomEdit={roomEdit} offModal={offModal} />}
    </div>
  );
};

export default ListRoom;
