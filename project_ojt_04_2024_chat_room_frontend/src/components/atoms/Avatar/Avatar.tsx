import { memo } from 'react';
import './avatar.scss';

const Avatar = (props: { source: string | undefined; className?: string }) => {
  return (
    <div className={props.className ? props.className : 'avatar'}>
      <img
        src={
          props.source
            ? props.source
            : 'https://firebasestorage.googleapis.com/v0/b/project-shop-gundam.appspot.com/o/Basic_Ui__28186_29.jpg?alt=media&token=a5008d11-c2af-45fe-87c0-3f25508f4c78'
        }
        alt="User Avatar"
      />
    </div>
  );
};

export default memo(Avatar);
