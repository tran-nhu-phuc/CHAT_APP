import { ChangeEvent, useState } from 'react';
import styles from './ProfileModal.module.scss';
import Loading from '../../atoms/Loading';
import { useSelector } from 'react-redux';
import { selectAvatarUrl } from '../../../store/slices/checkUpdateAvatar.slice';
import { selectDataLogin } from '../../../store/slices/dataLogin.silce';

interface Props {
  uploadAvatar: boolean;
  handleSelected: (file: File) => void;
  handleSave: () => void;
  handleClose: () => void;
}

const ProfileModal: React.FC<Props> = (props: Props) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const avatarUrl = useSelector(selectAvatarUrl);
  const dataLogin = useSelector(selectDataLogin);

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setErrorMessage(null);
      props.handleSelected(file);
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setAvatarPreview(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleSaveClick = () => {
    if (avatarPreview) {
      props.handleSave();
    } else {
      setErrorMessage('Please select a new image before saving.');
    }
  };
  console.log(avatarPreview);

  return (
    <div className={styles.profileModal}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={props.handleClose}>
          X
        </button>
        <h2>Thông tin account</h2>
        <div className={styles.accountInfo}>
          <div className={styles.accountItem}>
            <label>Email:</label>
            <span>{dataLogin.email}</span>
          </div>
          <div className={styles.accountItem}>
            <label>Họ:</label>
            <span>{dataLogin.lastName}</span>
          </div>
          <div className={styles.accountItem}>
            <label>Tên:</label>
            <span>{dataLogin.firstName}</span>
          </div>
          <div className={styles.accountItem}>
            <label>Ngày tháng năm sinh:</label>
            <span>{dataLogin.birthDate}</span>
          </div>
          <div className={styles.accountItem}>
            <label>Điện thoại:</label>
            <span>{dataLogin.phone}</span>
          </div>
        </div>
        <h2>Thông tin Cơ bản</h2>
        <div className={styles.basicInfo}>
          <div className={styles.basicItem}>
            <label>Ảnh đại diện:</label>
            {props.uploadAvatar ? (
              <Loading className="full-page-loader" color="#36D7B7" size={30} />
            ) : (
              <>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className={styles.avatar} />
                ) : (
                  <img
                    src={
                      avatarUrl
                        ? avatarUrl
                        : dataLogin.avatar
                          ? dataLogin.avatar
                          : 'https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745'
                    }
                    alt="avatar"
                    className={styles.avatar}
                  />
                )}
              </>
            )}
            <input type="file" onChange={handleAvatarChange} />
          </div>
        </div>
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        <button onClick={handleSaveClick} className={styles.saveButton}>
          Save
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;
