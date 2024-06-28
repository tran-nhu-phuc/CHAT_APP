import { memo } from 'react';
import './index.scss';
interface Props {
  className?: string;
  image?: string;
}
const NoDataImage: React.FC<Props> = (props: Props) => {
  return (
    <div className={props.className ? props.className : 'no-data__container'}>
      <img
        className="no-data-image"
        src={
          props.image ? props.image : 'https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127823.jpg'
        }
        alt="No Data"
      />
    </div>
  );
};
export default memo(NoDataImage);
