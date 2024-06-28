import React from 'react';
import styles from './style.module.scss';

interface InputGroupInterface {
  title: string;
  name: string;
  type: string;
  value: string;
  error?: string;
  maxLength?: number;
  placeHolder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputGroup: React.FC<InputGroupInterface> = (
  { title, name, type, value, error, onChange, maxLength, placeHolder } = {
    error: '',
    title: '',
    name: '',
    value: '',
    onChange: () => {},
    type: 'text',
    placeHolder: '',
  },
) => {
  return (
    <div className={styles['form-group']}>
      <label className={styles['form-label']}>{title}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={styles['input-field']}
        maxLength={maxLength}
        placeholder={placeHolder}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default InputGroup;
