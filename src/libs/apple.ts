import { axiosClient } from '@/queries/clients';

const APPLE_CLIENT_ID = import.meta.env.VITE_APPLE_CLIENT_ID;
const APPLE_REDIRECT_URI = import.meta.env.VITE_APPLE_REDIRECT_URI;

export const getAppleLoginUrl = () => {
  const state = Math.random().toString(36).substr(2, 11);
  localStorage.setItem('appleState', state);

  return `https://appleid.apple.com/auth/authorize?client_id=${APPLE_CLIENT_ID}&redirect_uri=${APPLE_REDIRECT_URI}&response_type=code%20id_token&scope=name%20email&response_mode=form_post&state=${state}`;
};

export const getAppleToken = async (code: string) => {
  const { data } = await axiosClient.post('/auth/signin/social', {
    thirdPartyType: 'A',
    SocialAccessToken: code,
    device_token: window.fcmToken || '',
    device_type: window.osType || 'android'
  });

  return data.body[0].accessToken;
};
