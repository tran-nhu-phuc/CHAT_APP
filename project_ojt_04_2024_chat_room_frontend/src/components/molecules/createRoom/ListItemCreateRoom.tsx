/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import './ListItemCreateRoom.scss';
import { ChangeEvent, memo, useEffect, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IDataCreateRoom } from '../../../types/dataCreateRoom.type';
import { MdDragIndicator } from 'react-icons/md';
import { IoIosArrowDropdown, IoIosArrowDropup } from 'react-icons/io';
import EditMembers from '../../organisms/editMembers/EditMembers';
import { useDispatch } from 'react-redux';
import {
  removeDataCreateRoom,
  selectCreateRoomData,
  switchDataCreateRoom,
} from '../../../store/slices/DataCreateRoom.slice';
import { ERRORS } from '../../../constants/errors.constant';
import { IERoom } from '../../../types/errorsRoom.type';
import { useSelector } from 'react-redux';

interface Props {
  dataRoom: IDataCreateRoom;
  dataRef: any;
  updateNameFormData: Function;
  errorsRoom: IERoom[];
  error?: IERoom | undefined;
  roomEdit?: any;
}

const ListItemCreateRoom = (props: Props): JSX.Element => {
  const dispatch = useDispatch();
  const dataCreateRoom = useSelector(selectCreateRoomData);
  const [isDrop, setIsDrop] = useState<boolean>(false);
  const [isEditMember, setIsEditMember] = useState<boolean>(false);
  const [listMembers, setListMembers] = useState<IDataCreateRoom[]>([]);
  const [room, setRoom] = useState<IDataCreateRoom>({
    name: props.dataRoom.name,
    id: props.dataRoom.id,
    members: props.dataRoom.members,
  });
  const [errorItem, setErrorItem] = useState<IERoom>({
    id: props.dataRoom.id,
    name: true,
    members: true,
  });

  // Update name of the room
  useEffect(() => {
    props.updateNameFormData(room);
  }, [room]);

  // State when have error
  useEffect(() => {
    if (props.error) {
      setErrorItem(props.error);
    }
  }, [props.error]);

  // Side effects drop when mount component
  useEffect(() => {
    setIsDrop(true);
  }, []);

  // Side effects scroll when have error
  useEffect(() => {
    const element = document.getElementById(`scroll_${props.dataRoom?.id}`);
    if (element) {
      if (props.errorsRoom[0]?.id === props.dataRoom?.id) {
        element.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
    }
    setIsDrop(true);
  }, [props.errorsRoom]);

  // Side effects scroll when add room
  useEffect(() => {
    const element = document.getElementById(`scroll_${props.dataRoom?.id}`);
    if (element) {
      if (dataCreateRoom[dataCreateRoom.length - 1]?.id === props.dataRoom?.id) {
        element.scrollIntoView({ block: 'end', inline: 'end', behavior: 'smooth' });
      }
    }
  }, [props.dataRef]);

  // Handle data list-members for edit members
  useEffect(() => {
    if (isDrop) {
      const result = props.dataRef.current.find((item: IDataCreateRoom) => item.id === props.dataRoom.id);
      if (result) {
        setListMembers(result.members);
      }
    }
  }, [isDrop, isEditMember]);

  // Use useSortable from dnd-kit
  const { attributes, setNodeRef, transform, transition, isDragging, listeners } = useSortable({
    id: Number(props.dataRoom.id),
    transition: { duration: 200, easing: 'linear' },
    data: { ...props.dataRoom },
  });

  // style from dnd-kit
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    borderColor: props.error ? '#C31918' : isDragging ? '#0762FE' : '#ccc',
    opacity: isDragging ? 0.2 : undefined,
  };

  // Remove the rooms
  const handleRemoveRoom = () => {
    dispatch(removeDataCreateRoom(props.dataRoom?.id));
  };

  // Change event listeners for the room
  const changeRoomName = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      setErrorItem({ ...errorItem, name: false });
    } else {
      setErrorItem({ ...errorItem, name: true });
    }
    setRoom({ ...room, name: e.target.value });
  };

  // Unmount component EditMembers
  const offEditMember = () => {
    setIsEditMember(false);
  };

  const getErrorItem = (value: boolean) => {
    setErrorItem({ ...errorItem, members: value });
  };
  return (
    <li
      id={`scroll_${props.dataRoom?.id}`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="create-room__list-items-container"
    >
      <div className="create-room_list-items__header">
        <div className="create-room_list-items__header-left">
          {props.dataRef.current?.length > 1 && !isDrop && (
            <MdDragIndicator
              className="create-room_list-items__header-left__drag"
              {...listeners}
              style={{ cursor: 'pointer' }}
            />
          )}
          <h1>{room.name === '' ? (props.dataRoom?.name ? props.dataRoom?.name : 'New') : room.name}</h1>
        </div>
        <div className="create-room_list-items__header-right">
          {!isDrop ? (
            <IoIosArrowDropdown
              onClick={() => {
                setIsDrop(true);
              }}
              className="create-room_list-items__header__drop"
            />
          ) : (
            <IoIosArrowDropup
              onClick={() => {
                setIsDrop(false);
                dispatch(switchDataCreateRoom(props.dataRef.current));
              }}
              className="create-room_list-items__header__drop"
            />
          )}
          {!props.roomEdit && <span onClick={handleRemoveRoom}>Delete</span>}
        </div>
      </div>
      {isDrop && (
        <div className="create-room__list-items__main">
          <div className="create-room__list-items__main__room-name">
            <label className={!errorItem.name ? 'error-name' : 'create-room__list-items__main__room-name__title'}>
              Room Name:{' '}
            </label>
            <input onChange={changeRoomName} value={room.name} type="text" />
          </div>
          <span className={!errorItem.name ? 'error-name__text' : 'create-room__list-items__main__room-name__error'}>
            {!errorItem.name ? ERRORS.ROOM_NAME : ''}
          </span>
          <div className="create-room__list-items__main__room-members">
            <label
              className={!errorItem.members ? 'error-members' : 'create-room__list-items__main__room-members__title'}
            >
              Members:{' '}
            </label>
            <ul>
              {listMembers &&
                listMembers.map((member) => {
                  return (
                    <li
                      style={{
                        color: props.roomEdit && props.roomEdit.creatorId === member.id ? '#C31918' : '#081C36',
                      }}
                      key={member?.id}
                    >
                      {member?.name}
                    </li>
                  );
                })}
            </ul>
          </div>
          <span
            className={
              !errorItem.members ? 'error-members__text' : 'create-room__list-items__main__room-members__error'
            }
          >
            {!errorItem.members ? ERRORS.MEMBERS : ''}
          </span>
          <span className="create-room__list-items__main__edit-text" onClick={() => setIsEditMember(true)}>
            Edit members
          </span>
          {isEditMember && (
            <EditMembers
              listMembers={listMembers}
              dataRoom={props.dataRoom}
              dataRef={props.dataRef}
              offEditMember={offEditMember}
              getError={getErrorItem}
              roomEdit={props.roomEdit}
              type={'editRoom'}
            />
          )}
        </div>
      )}
    </li>
  );
};

export default memo(ListItemCreateRoom);
