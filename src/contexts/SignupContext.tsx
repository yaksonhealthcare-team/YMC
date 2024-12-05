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
}

const SignupContext = createContext<SignupContextType | undefined>(undefined)

const initialState: UserSignup = {
  name: "",
  mobileno: "",
  birthdate: "",
  gender: "",
  di: "",
  tokenVersionId: "",
  encData: "",
  integrityValue: "",
  email: "",
  password: "",
  addr1: "",
  addr2: "",
  fileToUpload: null,
  recom: "",
  marketingYn: false,
}

export const SignupProvider = ({ children }: { children: ReactNode }) => {
  const [signupData, setSignupData] = useState<UserSignup>(initialState)

  return (
    <SignupContext.Provider value={{ signupData, setSignupData }}>
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
