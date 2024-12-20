import { signInWithPopup, UserCredential } from "@firebase/auth"
import { auth, googleProvider, appleProvider } from "./firebase"

export const signInWithGoogle = async () => {
  const result: UserCredential = await signInWithPopup(auth, googleProvider)
  return result.user.getIdToken()
}

export const signInWithApple = async () => {
  const result: UserCredential = await signInWithPopup(auth, appleProvider)
  return result.user.getIdToken()
}
