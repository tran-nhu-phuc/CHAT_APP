import { ChangeEvent, FormEvent, useState } from 'react';
import styles from './RegisterPage.module.scss';
import { UserRoles } from '../../enums/enum.util';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/authService/register.service';
import { ErrorType } from '../../types/common.type';
import InputGroup from '../../components/molecules/inputGroup';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    phone: '',
    role: UserRoles.MEMBER,
  });

  const [errors, setErrors] = useState<ErrorType>({});

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await userService.registerService(formData);
      alert('Registration successfully!');
      navigate('/');
    } catch (error) {
      const err = error as ErrorType;
      setErrors(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <h3 className={styles.heading}>Account</h3>
          <div className={styles['form-container']}>
            <InputGroup
              title="Email:"
              name="email"
              type="email"
              error={errors?.email}
              value={formData.email}
              onChange={handleChange}
            />
            <InputGroup
              title="Password:"
              name="password"
              type="password"
              error={errors?.password}
              value={formData.password}
              onChange={handleChange}
            />
            <InputGroup
              title="Confirm Password:"
              name="confirmPassword"
              type="password"
              error={errors?.confirmPassword}
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <InputGroup
              title="First Name:"
              name="firstName"
              type="text"
              error={errors?.firstName}
              value={formData.firstName}
              onChange={handleChange}
            />
            <InputGroup
              title="Last Name:"
              name="lastName"
              type="text"
              error={errors?.lastName}
              value={formData.lastName}
              onChange={handleChange}
            />
            <InputGroup
              title="Date of Birth:"
              name="birthDate"
              type="date"
              error={errors?.birthDate}
              value={formData.birthDate}
              onChange={handleChange}
            />
            <InputGroup
              title="Phone Number:"
              name="phone"
              type="phone"
              error={errors?.phone}
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <h3 className={styles.heading}>Thông tin cơ bản</h3>
          <label className={styles['role-label']}>Role:</label>
          <div className={styles['select-role-container']}>
            <div className={styles['selected-role']}>
              <input type="radio" name="role" value={UserRoles.ADMIN} onChange={handleChange} />
              <label htmlFor="admin">Admin</label>
            </div>
            <div className={styles['selected-role']}>
              <input type="radio" name="role" value={UserRoles.GROUP_LEADER} onChange={handleChange} />
              <label htmlFor="groupLead">Group Lead</label>
            </div>
            <div className={styles['selected-role']}>
              <input defaultChecked type="radio" name="role" value={UserRoles.MEMBER} onChange={handleChange} />
              <label htmlFor="member">Member</label>
            </div>
          </div>
        </div>

        <button className={styles['submit-btn']} type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
