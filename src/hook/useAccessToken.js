// useAccessToken.js
import { useSelector } from 'react-redux';

const useAccessToken = () => {
  const accessToken = useSelector(state => state.auth.user?.token || null);
  return accessToken;
};

export default useAccessToken;
