// userUtils.js
import Cookies from 'js-cookie';

export const getUserInfo = () => {
  const userInfo = {
    token: Cookies.get('access_token'),
    userType: Cookies.get('user_type'),
    username: Cookies.get('user_name'),
    userId: Cookies.get('user_id'),
    email: Cookies.get('user_email'),
  };

  // Check if essential fields (like token) are missing
  if (!userInfo.token) return null;

  return userInfo;
};
