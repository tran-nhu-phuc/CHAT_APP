import { memo } from 'react';
import { ClipLoader } from 'react-spinners';
import './index.scss';

interface Props {
  color: string;
  size: number;
  className?: string;
}

const Loading: React.FC<Props> = (props: Props) => {
  const { color, size, className } = props;

  return (
    <div className={className ? `${className}` : 'full-page-loader'}>
      <ClipLoader color={color} size={size} speedMultiplier={1.5} loading={true} />
    </div>
  );
};

export default memo(Loading);
