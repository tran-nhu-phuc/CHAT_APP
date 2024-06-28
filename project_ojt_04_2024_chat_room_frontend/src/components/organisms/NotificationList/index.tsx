/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useEffect, useState } from 'react';
import { NotificationIntf } from '../../../types/entities.type';
import './index.scss';
import { notificationService } from '../../../services/notification.service';
import NotificationBox from '../../molecules/NotificationBox';
import { useSelector } from 'react-redux';

const NotificationList = () => {
  const [notificationDb, setNotificationDb] = useState<NotificationIntf[]>([]);
  const [pageNotice, setPageNotice] = useState<number>(1);
  const [activeNotification, setActiveNotification] = useState<number>();
  const eventNotice = useSelector((state: any) => state.notificationSlice.status);

  const getAllNotifications = async (reset = false): Promise<void> => {
    try {
      const urlEndpoint = `?page=${pageNotice}&limit=${20}`;
      const result = await notificationService.getAllNotifications(urlEndpoint);
      setNotificationDb((prevDataListNotice) => (reset ? [...result?.data] : [...prevDataListNotice, ...result?.data]));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
  const handleClickNotification = (notificationId: number) => {
    setActiveNotification(notificationId);
  };
  useEffect(() => {
    getAllNotifications();
  }, [pageNotice]);

  useEffect(() => {
    setPageNotice(1);
    getAllNotifications(true);
  }, [eventNotice]);

  useEffect(() => {
    const container = document.querySelector('.sidebar-list__container');
    if (!container) return;

    const handleScroll = () => {
      const maxScroll = container.scrollHeight - container.clientHeight;
      const currentPosition = maxScroll - container.scrollTop;

      if (Math.round(currentPosition) === 0) {
        setPageNotice((prevPageNotice) => prevPageNotice + 1);
      }
    };

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="sidebar-list__container">
      {notificationDb.length !== 0 ? (
        <>
          {notificationDb.map((item: NotificationIntf, index: number) => (
            <div
              key={index}
              onClick={() => handleClickNotification(item.id)}
              className={`${activeNotification === item.id ? 'notification--active' : ''}`}
            >
              <NotificationBox notificationItem={item} />
            </div>
          ))}
        </>
      ) : (
        <div className="sidebar-box__no-notification">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/project-shop-gundam.appspot.com/o/caf9de31345d651707164295aed47a07.jpg?alt=media&token=703cd6a5-74e5-402d-8a33-1353972f3aa5"
            alt="No notifications"
          />
        </div>
      )}
    </div>
  );
};

export default memo(NotificationList);
