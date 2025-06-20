import { axiosClient } from '@/queries/clients';

const GOOGLE_CLIENT_ID = '39001505358-fosqvj6oti6qgiud6ispraraoo7niut6.apps.googleusercontent.com';
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

export const getGoogleLoginUrl = async () => {
  const state = Math.random().toString(36).substr(2, 11);
  localStorage.setItem('googleState', state);

  return `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&scope=email%20profile&state=${state}`;
};

export const getGoogleToken = async (code: string) => {
  const { data } = await axiosClient.post('/auth/signin/social', {
    thirdPartyType: 'G',
    SocialAccessToken: code,
    device_token: window.fcmToken || '',
    device_type: window.osType || 'android'
  });

  return data.body[0].accessToken;
};
