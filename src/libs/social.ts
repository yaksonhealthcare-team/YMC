import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider, appleProvider } from "./firebase"

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider)
  return result.user.accessToken
}

export const signInWithApple = async () => {
  const result = await signInWithPopup(auth, appleProvider)
  return result.user.accessToken
}
