import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react"
import { UserSignup } from "../types/User.ts"

interface SignupContextType {
  signupData: UserSignup
  setSignupData: Dispatch<SetStateAction<UserSignup>>
  cleanup: () => void
}

const initialState: UserSignup = {
  name: "",
  mobileNumber: "",
  birthDate: "",
  gender: "",
  di: "",
  tokenVersionId: "",
  encData: "",
  integrityValue: "",
  email: "",
  password: "",
  postCode: "",
  address1: "",
  address2: "",
  profileImage: null,
  brandCodes: [],
  referralCode: "",
  recom: "",
  marketingYn: false,
  // sessionStorage에서 소셜 정보 가져오기
  ...JSON.parse(sessionStorage.getItem("socialSignupInfo") || "{}"),
}

const SignupContext = createContext<SignupContextType | undefined>(undefined)

export const SignupProvider = ({ children }: { children: ReactNode }) => {
  const [signupData, setSignupData] = useState<UserSignup>(initialState)

  // 회원가입 완료 시 호출할 cleanup 함수
  const cleanup = () => {
    sessionStorage.removeItem("socialSignupInfo")
  }

  return (
    <SignupContext.Provider value={{ signupData, setSignupData, cleanup }}>
      {children}
    </SignupContext.Provider>
  )
}

export const useSignup = (): SignupContextType => {
  const context = useContext(SignupContext)
  if (!context) {
    throw new Error("useSignup must be used within a SignupProvider")
  }
  return context
}
