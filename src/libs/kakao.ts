export const getKakaoLoginUrl = () => {
  return `${import.meta.env.VITE_KAKAO_REDIRECT_URI}?scope=account_email`;
};
