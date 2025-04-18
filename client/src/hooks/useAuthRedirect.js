import { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';

const useAuthRedirect = () => {
  const { auth } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { pathname } = location;
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    if (!auth) {
      if (!isAuthPage) {
        navigate('/login');
      }
    } else {
      if (isAuthPage) {
        const role = auth.payload?.role;
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      }
    }
  }, [auth, location.pathname, navigate]);
};

export default useAuthRedirect;
