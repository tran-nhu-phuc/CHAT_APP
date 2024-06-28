/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, MouseEvent, useMemo } from 'react';
import './CreateRoom.scss';
import CreateRoomHeader from '../../organisms/createRoom/header/CreateRoomHeader';
import CreateRoomMain from '../../organisms/createRoom/main/CreateRoomMain';
import {
  dataEditRoom,
  resetDataCreateRoom,
  selectCreateRoomData,
  setDataCreateRoom,
  switchDataCreateRoom,
} from '../../../store/slices/DataCreateRoom.slice';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { roomService } from '../../../services/room.service';
import { IERoom } from '../../../types/errorsRoom.type';
import { IDataCreateRoom } from '../../../types/dataCreateRoom.type';
import { formatName } from '../../../utilities/format.ulti';
import { compareArrays } from '../../../utilities/compareArray';
import { updateListRoom } from '../../../store/slices/updateListRoom.slice';

interface Props {
  roomEdit?: any;
  offModal: Function;
}

function CreateRoomTemplate(props: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [errorRoom, setErrorRoom] = useState<IERoom[]>([]);
  const dataCreateRoom = useSelector(selectCreateRoomData);
  const dispatch = useDispatch();

  // Initial temporary data for creating a room
  const dataRef = useRef(dataCreateRoom);

  // Convert data members before editing
  const dataMembersEditRoom = useMemo(() => {
    if (props.roomEdit) {
      const result = props.roomEdit.userInRoom.map((item: any) => {
        return {
          id: item.user.id,
          name: formatName(item.user.firstName, item.user.lastName),
        };
      });
      return result;
    }
  }, [props.roomEdit]);

  // Mount component and set data edit for original data and set temporary data
  useEffect(() => {
    if (props.roomEdit) {
      dispatch(dataEditRoom({ id: props.roomEdit.id, name: props.roomEdit.name, members: dataMembersEditRoom }));
    }
    dataRef.current = dataCreateRoom;
  }, []);

  // When original data changes or on off component, set temporary data = original data
  useEffect(() => {
    dataRef.current = dataCreateRoom;
  }, [isOpen, dataCreateRoom]);

  const getOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  // Handle update dataRef
  const updateNameFormData = (obj: IDataCreateRoom) => {
    const data = dataRef.current.map((item: IDataCreateRoom) => {
      if (item.id === obj.id) {
        return {
          ...item,
          name: obj.name,
        };
      }
      return item;
    });
    dataRef.current = data;
  };

  // Handle add room
  const handleAddRoom = (obj: IDataCreateRoom) => {
    dispatch(switchDataCreateRoom(dataRef.current));
    dispatch(setDataCreateRoom(obj));
  };

  // Submit data to room service
  const handleSubmit = async () => {
    const result = await roomService.validateFormRoom(dataRef.current);
    if (result.length === 0) {
      if (props.roomEdit) {
        await roomService.editRoom(dataRef.current, dataMembersEditRoom, props.roomEdit);
        alert('Edit room successfully');
      } else {
        await roomService.createRoom(dataRef.current);
        alert('Create rooms successfully');
      }
      setErrorRoom(result);
      dispatch(resetDataCreateRoom());
      dispatch(updateListRoom());
      props.offModal();
    } else {
      setErrorRoom(result);
      dispatch(switchDataCreateRoom(dataRef.current));
    }
  };

  // Cancel Modal
  const handleCancel = () => {
    if (props.roomEdit) {
      const check = dataRef.current.find((item: IDataCreateRoom) => item.id === props.roomEdit.id);
      if (check) {
        const membersIdNew = check.members.map((item: any) => item.id);
        const membersIdOld = props.roomEdit?.userInRoom.map((item: any) => item.user.id);
        if (props.roomEdit.name === check.name && compareArrays(membersIdOld, membersIdNew)) {
          props.offModal();
          dispatch(resetDataCreateRoom());
        } else {
          if (confirm('Data have been updated, Are you sure cancel?')) {
            props.offModal();
            dispatch(resetDataCreateRoom());
          } else {
          }
        }
      }
    } else {
      props.offModal();
      dispatch(resetDataCreateRoom());
    }
  };

  // Handle Move around component
  // Ref of component needs to Move around
  const draggableRef: any = useRef(null);
  // Default Position
  const startPosition = useRef({ x: 0, y: 0 });
  // Current Position
  const position = useRef({ x: 0, y: 0 });
  // Check Draggable
  const isDragging = useRef(false);
  // Position before move up
  const lastMousePosition = useRef({ x: 0, y: 0 });

  /**
   * Handle mouse down events
   *
   * @param e MouseEvent<HTMLElement>
   * @constant clientX - Position along the x-axis from the left edge of the element to the left edge of the web page
   * @constant clientY - Position along the y-axis from the top edge of the element to the top edge of the web page
   * @constant isDragging.current = true if !isOpen
   * @addEvent mousemove and mouseup
   */
  const handleMouseDown = (e: MouseEvent<HTMLElement>) => {
    if (!isOpen) {
      startPosition.current = { x: e.clientX, y: e.clientY };
      isDragging.current = true;
      lastMousePosition.current = { x: e.clientX, y: e.clientY };
      draggableRef.current.addEventListener('mousemove', handleMouseMove);
      draggableRef.current.addEventListener('mouseup', handleMouseUp);
    }
  };

  /**
   * Handle mouse move events
   *
   * @param e MouseEvent<HTMLElement>
   */
  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (isDragging.current) {
      const currentX = e.clientX - lastMousePosition.current.x;
      const currentY = e.clientY - lastMousePosition.current.y;
      position.current = { x: position.current.x + currentX, y: position.current.y + currentY };
      lastMousePosition.current = { x: e.clientX, y: e.clientY };
      draggableRef.current.style.left = position.current.x + 'px';
      draggableRef.current.style.top = position.current.y + 'px';
    }
  };

  /**
   * Handle mouse up events
   *
   * @constant isDragging.current = false
   * @removeEvent mousemove and mouseup
   */
  const handleMouseUp = () => {
    isDragging.current = false;
    draggableRef.current.removeEventListener('mousemove', handleMouseMove);
    draggableRef.current.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <section
      ref={draggableRef}
      style={{ position: 'absolute', left: '0px', top: '0px', zIndex: '99' }}
      onMouseDown={handleMouseDown}
      className="create-room"
    >
      <CreateRoomHeader roomEdit={props.roomEdit} dataRef={dataRef} getOpen={getOpen} />
      {isOpen && (
        <CreateRoomMain
          roomEdit={props.roomEdit}
          handleAddRoom={handleAddRoom}
          errorsRoom={errorRoom}
          dataRef={dataRef}
          updateNameFormData={updateNameFormData}
        />
      )}
      {isOpen && (
        <div className="create-room__footer">
          <div className="create-room__footer-actions">
            <button onClick={handleCancel}>Cancel</button>
            <button onClick={handleSubmit}>{!props.roomEdit ? 'Submit' : 'Save'}</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default CreateRoomTemplate;
