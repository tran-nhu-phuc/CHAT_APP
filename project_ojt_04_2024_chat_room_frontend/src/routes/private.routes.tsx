import { Navigate, Outlet } from 'react-router-dom';
import DefaultLayout from '../components/templates/defaultLayout';
import { useSelector } from 'react-redux';
import { selectDataLogin } from '../store/slices/dataLogin.silce';

export default function PrivateRoute(): JSX.Element {
  const checkLogin = useSelector(selectDataLogin);

  return checkLogin ? (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  ) : (
    <Navigate to={'/auth/login'} />
  );
}
