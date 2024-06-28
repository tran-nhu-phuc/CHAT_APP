import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import PrivateRoute from './routes/private.routes';
import NotificationPage from './pages/NotificationPage';
import { useDispatch } from 'react-redux';
import { checkingUserSignInService } from './services/userService/user.service';
import { selectDataLogin, setDataLogin } from './store/slices/dataLogin.silce';
import './assets/scss/styleGlobal.scss';
import { useSelector } from 'react-redux';
import Home from './pages/Home';
import ListRoom from './pages/roomManager/RoomManagerPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterLayout from './components/templates/registerLayout';
function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const checkLogin = useSelector(selectDataLogin);

  useEffect(() => {
    const token: string | null = localStorage.getItem('access_token');
    if (token && !checkLogin) {
      checkingUserSignInService()
        .then((result) => {
          dispatch(setDataLogin(result));
          navigate('/');
        })
        .catch((error) => {
          console.error(error);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<PrivateRoute />}>
          <Route index element={<Home />} />
          <Route path="/notification" element={<NotificationPage />} />
          <Route path="/room-manager/:id" element={<ListRoom />} />
        </Route>
        {/* <Route path="*" element={<PageError />} /> */}
        <Route path="/register" element={<RegisterLayout />} />
        <Route path="auth/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
