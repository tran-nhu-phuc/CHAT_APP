import { Navigate } from 'react-router-dom';
import RegisterPage from '../../pages/RegisterPage/RegisterPage';
import SubMenu from '../organisms/SubMenu/SubMenu';
import './registerLayout.scss';
import { useSelector } from 'react-redux';
import { selectDataLogin } from '../../store/slices/dataLogin.silce';
const RegisterLayout = () => {
  const checkLogin = useSelector(selectDataLogin);

  return checkLogin ? (
    <div className="default-layout">
      <div className="default-layout__sub-menu">
        <SubMenu />
      </div>
      <div className="register-layout">
        <RegisterPage></RegisterPage>
      </div>
    </div>
  ) : (
    <Navigate to={'/auth/login'} />
  );
};

export default RegisterLayout;
