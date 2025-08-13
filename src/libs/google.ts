const GOOGLE_CLIENT_ID = '39001505358-fosqvj6oti6qgiud6ispraraoo7niut6.apps.googleusercontent.com';
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

export const getGoogleLoginUrl = async () => {
  const state = Math.random().toString(36).substr(2, 11);

  return `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&scope=email%20profile&state=${state}`;
};
