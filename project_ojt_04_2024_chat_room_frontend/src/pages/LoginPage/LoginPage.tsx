import React, { ChangeEvent, useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './LoginPage.module.scss';
import { authService } from '../../services/authService/auth.service';
import { useDispatch } from 'react-redux';
import { setDataLogin } from '../../store/slices/dataLogin.silce';
import { useNavigate } from 'react-router-dom';
import { ErrorType } from '../../types/common.type';
import LoadingPage from '../../components/atoms/LoadingPage';

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<ErrorType>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPage, setShowPage] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await authService.loginService(loginForm);
      dispatch(setDataLogin(response));
      navigate('/');
    } catch (error) {
      const err = error as ErrorType;
      setErrors(err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPage(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!showPage) {
    return <LoadingPage />;
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.modal}>
        <div className={styles['login-tittle']}>
          <img
            className={styles['logo-img']}
            src="https://res.cloudinary.com/dv9tkz5pa/image/upload/v1713257008/running/ejlgem5j8db7fnpnpk3j.avif"
            alt="logo"
          />
          <h4>Login</h4>
        </div>
        <form className={styles.form} onSubmit={handleLogin}>
          <input
            className={styles.Input}
            type="text"
            name="email"
            placeholder="Your email"
            value={loginForm.email}
            onChange={handleChange}
          />
          {errors?.email && <p className={styles.errorMessage}>{errors.email}</p>}
          <div className={styles.passwordContainer}>
            <input
              className={styles.Input}
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={handleChange}
            />
            {showPassword ? (
              <FaEye className={styles.eyeIcon} onClick={togglePasswordVisibility} />
            ) : (
              <FaEyeSlash className={styles.eyeIcon} onClick={togglePasswordVisibility} />
            )}
          </div>
          {errors?.password && <p className={styles.errorMessage}>{errors.password}</p>}
          {errors?.message && <p className={styles.errorMessage}>{errors.message}</p>}
          <button className={styles['login-button']} type="submit">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
