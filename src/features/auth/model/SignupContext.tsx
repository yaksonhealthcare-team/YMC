import { UserSignup } from '@/entities/user/model/User';
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

interface SignupContextType {
  signupData: UserSignup;
  setSignupData: Dispatch<SetStateAction<UserSignup>>;
  cleanup: () => void;
}

const initialState: UserSignup = {
  name: '',
  mobileNumber: '',
  birthDate: '',
  gender: 'M',
  di: '',
  tokenVersionId: '',
  encData: '',
  integrityValue: '',
  email: '',
  password: '',
  postCode: '',
  address1: '',
  address2: '',
  profileUrl: '',
  brandCodes: [],
  referralCode: '',
  recom: '',
  marketingYn: false,
  isIdExist: '',
  isSocialExist: {
    E: '',
    G: '',
    K: '',
    N: '',
    A: ''
  }
};

const SignupContext = createContext<SignupContextType | undefined>(undefined);

/**
 * @deprecated
 * 이 Provider가 필요한지 확인 후,
 * 필요하다면 zustand로 전환.
 * 필요없다면 순차적으로 제거.
 */
export const SignupProvider = ({ children }: { children: ReactNode }) => {
  const [signupData, setSignupData] = useState<UserSignup>(initialState);

  // 회원가입 완료 시 호출할 cleanup 함수
  const cleanup = () => {
    sessionStorage.removeItem('socialSignupInfo');
  };

  return <SignupContext.Provider value={{ signupData, setSignupData, cleanup }}>{children}</SignupContext.Provider>;
};

export const useSignup = (): SignupContextType => {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error('useSignup must be used within a SignupProvider');
  }
  return context;
};
