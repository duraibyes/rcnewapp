import { useDispatch } from 'react-redux';
import { logoutUser } from '../app/slices/authSlice';
import { Button } from 'react-bootstrap';

const LogoutButton = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <Button onClick={handleLogout}>Logout</Button>
  );
};

export default LogoutButton;
