/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import './CreateRoomHeader.scss';
import { useDispatch } from 'react-redux';
import { switchDataCreateRoom } from '../../../../store/slices/DataCreateRoom.slice';
interface Props {
  getOpen: Function;
  dataRef: any;
  roomEdit?: any;
}
function CreateRoomHeader(props: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const draggableHeaderRef: any = useRef(null);

  // SideEffects for Drag when open, close
  useEffect(() => {
    isOpen ? (draggableHeaderRef.current.style.cursor = 'no-drop') : (draggableHeaderRef.current.style.cursor = 'move');
  }, [isOpen]);
  return (
    <div ref={draggableHeaderRef} className="create-room__header">
      <h1>{!props.roomEdit ? 'Create Rooms' : 'Edit Room'}</h1>
      <div className="create-room__header__actions">
        {!isOpen ? (
          <span
            onClick={() => {
              setIsOpen(true);
              props.getOpen(true);
            }}
          >
            Open
          </span>
        ) : (
          <span
            onClick={() => {
              setIsOpen(false);
              props.getOpen(false);
              dispatch(switchDataCreateRoom(props.dataRef.current));
            }}
          >
            Close
          </span>
        )}
      </div>
    </div>
  );
}

export default CreateRoomHeader;
