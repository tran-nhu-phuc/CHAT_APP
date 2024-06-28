import { memo } from 'react';
import './index.scss';

const Input = ({
  type,
  name,
  placeholder,
  required,
}: {
  type: string;
  name: string;
  placeholder: string;
  required: boolean;
}) => {
  return <input type={type} placeholder={`${placeholder}`} name={name} required={required} />;
};

export default memo(Input);
