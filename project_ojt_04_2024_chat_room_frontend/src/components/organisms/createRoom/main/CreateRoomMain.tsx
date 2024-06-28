/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from 'react-redux';
import './CreateRoomMain.scss';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import ListItemCreateRoom from '../../../molecules/createRoom/ListItemCreateRoom';
import {
  selectCreateRoomData,
  setDataCreateRoom,
  switchDataCreateRoom,
} from '../../../../store/slices/DataCreateRoom.slice';
import { IDataCreateRoom } from '../../../../types/dataCreateRoom.type';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { IERoom } from '../../../../types/errorsRoom.type';
import { IRoom } from '../../../../apis/rooms/responses/room.response';
import { MdDragIndicator } from 'react-icons/md';
import { IoIosArrowDropdown } from 'react-icons/io';
import { selectDataLogin } from '../../../../store/slices/dataLogin.silce';
import { formatName } from '../../../../utilities/format.ulti';

interface Props {
  dataRef: any;
  errorsRoom: IERoom[];
  updateNameFormData: Function;
  handleAddRoom: Function;
  roomEdit?: IRoom;
}

function CreateRoomMain(props: Props) {
  const [activeData, setActiveData] = useState<any>(null);
  const [activeId, setActiveId] = useState<any>(null);
  const dataCreateRoom = useSelector(selectCreateRoomData);
  const dispatch = useDispatch();
  const userLogin = useSelector(selectDataLogin);

  // Check is button Drag
  useEffect(() => {
    dataCreateRoom.length >= 10 ? setIsAddRoom(false) : setIsAddRoom(true);
  }, [dataCreateRoom]);

  // Handle events Drag when ending
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event?.active?.id);
    setActiveData(event?.active.data.current);
  };

  // Handle events Drag when ending
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = props.dataRef.current.findIndex((item: IDataCreateRoom) => item.id === active.id);
      const newIndex = props.dataRef.current.findIndex((item: IDataCreateRoom) => item.id === over.id);

      const newDataCreateRoom = arrayMove(props.dataRef.current, oldIndex, newIndex);
      dispatch(switchDataCreateRoom(newDataCreateRoom));
      setActiveId(null);
      setActiveData(null);
    }
  };

  // Set sensor for Drag
  const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 9 } });
  const mySensor = useSensors(pointerSensor);

  // Add Room to Redux
  const [isAddRoom, setIsAddRoom] = useState<boolean>(true);
  const handleAddRoom = () => {
    props.handleAddRoom({
      name: '',
      members: [
        {
          id: userLogin.id,
          name: formatName(userLogin.firstName, userLogin.lastName),
        },
      ],
    });
  };

  // SideEffects for origin data when mount component
  useEffect(() => {
    if (props.roomEdit && dataCreateRoom.length === 0) {
      dispatch(
        setDataCreateRoom({
          id: props.roomEdit.id,
          name: props.roomEdit.name,
          members: props.roomEdit.members,
        }),
      );
    } else {
      if (dataCreateRoom.length === 0) {
        dispatch(
          setDataCreateRoom({
            name: '',
            members: [
              {
                id: userLogin.id,
                name: formatName(userLogin.firstName, userLogin.lastName),
              },
            ],
          }),
        );
      }
    }
  }, []);
  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={mySensor}>
      <div onMouseDown={(e) => e.stopPropagation()} className="create-room__main">
        {dataCreateRoom.length === 0 ? (
          <img
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            src="https://cdn.icon-icons.com/icons2/2483/PNG/512/empty_data_icon_149938.png"
            alt="No data"
          />
        ) : (
          <SortableContext items={dataCreateRoom.map((item: IDataCreateRoom) => item.id)}>
            <ul className="create-room__main__list">
              {dataCreateRoom.length > 0 &&
                dataCreateRoom.map((item: IDataCreateRoom) => {
                  const error = props.errorsRoom.find((element: IERoom) => element.id === item.id);
                  return (
                    <ListItemCreateRoom
                      key={item.id}
                      dataRoom={item}
                      dataRef={props.dataRef}
                      errorsRoom={props.errorsRoom}
                      updateNameFormData={props.updateNameFormData}
                      roomEdit={props.roomEdit}
                      error={error}
                    />
                  );
                })}
              <DragOverlay
                dropAnimation={{
                  sideEffects: defaultDropAnimationSideEffects({
                    styles: { active: { opacity: '0.2', transition: '0.3' } },
                  }),
                }}
              >
                {!activeId && null}
                {activeId && (
                  <li className="create-room__list-items-container">
                    <div className="create-room_list-items__header">
                      <div className="create-room_list-items__header-left">
                        <MdDragIndicator className="create-room_list-items__header-left__drag" />
                        <h1>{activeData?.name === '' ? 'New' : activeData.name}</h1>
                      </div>
                      <div className="create-room_list-items__header-right">
                        <IoIosArrowDropdown className="create-room_list-items__header__drop" />
                        <span>Delete</span>
                      </div>
                    </div>
                  </li>
                )}
              </DragOverlay>
            </ul>
          </SortableContext>
        )}
        {props.roomEdit ? null : isAddRoom ? (
          <span className="create-room__main-add" onClick={handleAddRoom}>
            +Add Rooms
          </span>
        ) : null}
      </div>
    </DndContext>
  );
}

export default CreateRoomMain;
