import { memo } from 'react';
import Avatar from '../Avatar/Avatar';
import './index.scss';

const ChatPlaceholder = () => {
  return (
    <div className="chat-placeholder__container">
      <div className="chat-placeholder-item">
        <div className="chat-placeholder-item-avatar">
          <Avatar source="https://www.shutterstock.com/shutterstock/photos/2177806877/display_1500/stock-photo-aerial-view-of-the-golden-bridge-is-lifted-by-two-giant-hands-in-the-tourist-resort-on-ba-na-hill-2177806877.jpg" />
        </div>
        <div className="chat-placeholder-item-name">
          <strong>Trần như phúc</strong>
          <p>Hãy bắt đầu cùng nhau chia sẻ những điều tốt đẹp</p>
        </div>
      </div>
    </div>
  );
};
export default memo(ChatPlaceholder);
