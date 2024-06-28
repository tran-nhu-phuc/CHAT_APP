/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import './EditMembers.scss';
import { BiSearchAlt } from 'react-icons/bi';
import { userService } from '../../../services/user.service';
import { formatName } from '../../../utilities/format.ulti';
import { IDataCreateRoom } from '../../../types/dataCreateRoom.type';
import { IUserResponse } from '../../../apis/users/responses/user.response';
import { roomService } from '../../../services/room.service';
import { ERRORS } from '../../../constants/errors.constant';

interface Props {
  offEditMember: Function;
  dataRef?: any;
  dataRoom?: IDataCreateRoom;
  listMembers: IDataCreateRoom[];
  getError?: Function;
  roomEdit?: any;
  type: string;
}
function EditMembers(props: Props) {
  const [users, setUsers] = useState<IUserResponse[]>([]);
  const [isActive, setIsActive] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');

  // Get all users from database
  const getAllUsers = async () => {
    try {
      const result = await userService.getAllUsers();
      const userNeed = result?.data.map((item: IUserResponse) => {
        const check = props.listMembers.find((element: IDataCreateRoom) => item.id === element.id);
        if (check) {
          return {
            ...item,
            name: formatName(item.firstName, item.lastName),
            checked: true,
          };
        }
        return {
          ...item,
          name: formatName(item.firstName, item.lastName),
          checked: false,
        };
      });
      setUsers(userNeed);
      setIsActive('company');
    } catch (error) {
      console.log(error);
    }
  };

  // Mount component get users and set active for tab company
  useEffect(() => {
    getAllUsers();
  }, []);

  // Handle data when switch tabs.
  const data = useMemo(() => {
    if (searchValue.length === 0) {
      if (isActive === 'room') {
        return users.filter((user) => user.checked);
      } else if (isActive === 'company') {
        return users;
      }
    } else {
      return users.filter((user: IUserResponse) => user?.name.toLowerCase().includes(searchValue.toLowerCase()));
    }
  }, [isActive, searchValue]);

  // Change checkbox
  const changeCheckbox = (id: number) => {
    const result = users.map((user: IUserResponse) => {
      if (user.id === id) {
        user.checked = !user.checked;
      }
      return user;
    });
    setUsers(result);
  };

  // Handle save new data for dataRef
  const handleSaveMembers = async () => {
    // when this component for editing members
    if (props.type === 'editRoom') {
      const result = users.filter((item: IUserResponse) => item.checked === true);
      const membersArray = result.map((member: IUserResponse) => {
        return {
          id: member.id,
          name: formatName(member.firstName, member.lastName),
        };
      });
      const newData = props.dataRef.current.map((element: IDataCreateRoom) => {
        if (element.id === props.dataRoom?.id) {
          return {
            ...element,
            members: membersArray,
          };
        }
        return element;
      });

      if (membersArray.length < 2) {
        props.getError && props.getError(false);
      } else {
        props.getError && props.getError(true);
      }
      props.dataRef.current = newData;
    }

    // When this component for adding members
    if (props.type === 'addMember') {
      const newData = data?.filter((element: any) => element.checked);
      if (Number(newData?.length) < 2) {
        alert(ERRORS.MEMBERS);
      } else {
        const newMembers = {
          id: props.roomEdit.id,
          name: props.roomEdit.name,
          members: newData?.map((item: any) => {
            return {
              id: item.id,
              name: formatName(item.firstName, item.lastName),
            };
          }),
        };
        await roomService.editRoom([newMembers], props.listMembers);
      }
    }
    props.offEditMember();
  };

  // Change Search
  const changeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="edit-member__overlay">
      <div className="edit-member">
        <h1>Choose Members</h1>
        <div className="edit-member__tabs">
          <div className="edit-member__tabs-actions">
            <button
              className={isActive === 'company' ? 'edit-active' : undefined}
              onClick={() => setIsActive('company')}
            >
              Company
            </button>
            <button className={isActive === 'room' ? 'edit-active' : undefined} onClick={() => setIsActive('room')}>
              Room
            </button>
          </div>
          <div className="edit-member__tab-mains">
            <div className="edit-member__tab-mains__search">
              <BiSearchAlt className="edit-member__tab-mains__search-icon" />
              <input value={searchValue} onChange={changeSearch} placeholder="Search by name..." type="text" />
            </div>
            <ul className="edit-member__tab-mains__list-items">
              {data !== undefined &&
                data.length > 0 &&
                data?.map((member: any) => {
                  return (
                    <li
                      style={{
                        color: props.roomEdit && props.roomEdit.creatorId === member.id ? '#C31918' : '#081C36',
                      }}
                      key={member.id}
                      className="edit-member__tab-mains__list-item"
                    >
                      <label className="edit-member__tab-mains__list-item__name">{member.name}</label>
                      <input checked={member.checked} onChange={() => changeCheckbox(member.id)} type="checkbox" />
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
        <div className="edit-member__actions">
          <button onClick={() => props.offEditMember()}>Cancel</button>
          <button onClick={handleSaveMembers}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default EditMembers;
