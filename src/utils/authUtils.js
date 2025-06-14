import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLogoutUserMutation } from '@/features/api/authApi';
import { userLoggedOut } from '@/features/authSlice'; // Ensure this path is correct
import { toast } from 'react-toastify';

export const useUniversalLogout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(userLoggedOut());
      console.log('Logout successful');
      toast.success("Logout Successful!");
      navigate('/'); // Redirect to home page after logout
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return handleLogout;
};