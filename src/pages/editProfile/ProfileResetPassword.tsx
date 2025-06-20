import { resetPassword } from '@/apis/auth.api';
import ResetPassword from '@/components/resetPassword/ResetPassword';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfileResetPassword = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleChangePassword = async (password: string) => {
    if (!user) return;
    try {
      await resetPassword(password);
      navigate('complete');
    } catch (error) {
      console.error(error);
    }
  };

  return <ResetPassword requestPasswordChange={handleChangePassword} />;
};

export default ProfileResetPassword;
