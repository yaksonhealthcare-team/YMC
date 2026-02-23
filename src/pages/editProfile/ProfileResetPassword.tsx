import { useUserStore } from '@/_domain/auth';
import { resetPassword } from '@/entities/user/api/auth.api';
import ResetPassword from '@/features/auth/ui/resetPassword/ResetPassword';
import { useNavigate } from 'react-router-dom';

const ProfileResetPassword = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();

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
