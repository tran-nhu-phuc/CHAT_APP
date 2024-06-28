import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { socketConfig } from '../../../sockets/socket.config';
import { EVENT } from '../../../common/event';
import Avatar from '../../atoms/Avatar/Avatar';
import {
  IconBell,
  IconBxsMessageRoundedDetail,
  IconLogoutBoxFill,
  IconUserAdd,
  IconUsergroupAdd,
} from '../../atoms/Icon/Icon';
import './Submenu.scss';
import ProfileModal from '../../molecules/profileModal/profileModal';
import { selectDataLogin } from '../../../store/slices/dataLogin.silce';
import { checkUpdateAvatar, selectAvatarUrl } from '../../../store/slices/checkUpdateAvatar.slice';
import { uploadAvatarSerivce } from '../../../services/userService/user.service';
import { useDispatch } from 'react-redux';
import { UserRoles } from '../../../enums/enum.util';

const SubMenu = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>('');
  const dataLogin = useSelector(selectDataLogin);
  const avatarUrl = useSelector(selectAvatarUrl);
  const handleSelectedFile = (file: File) => {
    setSelectedFile(file);
  };
  const dispatch = useDispatch();
  console.log(avatar, 1);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    dispatch(checkUpdateAvatar(null));
  };

  useEffect(() => {
    setAvatar(avatarUrl);
  }, [avatarUrl]);
  console.log(avatar);

  const handleSave = async () => {
    if (!selectedFile) return;
    const socketUser = socketConfig.socketUser();
    setIsSaving(true);
    try {
      const imageUrl = await uploadAvatarSerivce(selectedFile);
      socketUser.emit(EVENT.EMIT.AVATAR, { avatar: imageUrl });
      setIsSaving(false);
    } catch (error) {
      console.error(error);
      setIsSaving(false);
    }
    dispatch(checkUpdateAvatar(null));
    setOpenModal(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div className="sub-menu__container">
      <div className="avatar" onClick={() => setOpenModal(true)}>
        <Avatar
          source={
            avatarUrl
              ? avatarUrl
              : dataLogin.avatar
                ? dataLogin.avatar
                : 'https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745'
          }
        />
      </div>
      <div className="controller">
        <Link to={'/'} className="icon">
          <IconBxsMessageRoundedDetail />
          <span className="tooltiptext">Message</span>
        </Link>
        <Link to={'/notification'} className="icon">
          <IconBell />
          <span className="tooltiptext">Notification</span>
        </Link>
        {dataLogin.role !== UserRoles.MEMBER && (
          <Link to={'/register'} className="icon">
            <IconUserAdd />
            <span className="tooltiptext">Register member</span>
          </Link>
        )}
        {dataLogin.role !== UserRoles.MEMBER && (
          <Link to={`/room-manager/${dataLogin.id}`} className="icon">
            <IconUsergroupAdd />
            <span className="tooltiptext">Create Room</span>
          </Link>
        )}
        <Link to={'/auth/login'}>
          <div className="icon" onClick={handleLogout}>
            <IconLogoutBoxFill />
            <span className="tooltiptext">Logout</span>
          </div>
        </Link>
      </div>
      {openModal && (
        <ProfileModal
          uploadAvatar={isSaving}
          handleSelected={handleSelectedFile}
          handleSave={handleSave}
          handleClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default SubMenu;
