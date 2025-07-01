const ACCESS_TOKEN = 'access_token';

export const saveAccessToken = (token: string) => {
  try {
    localStorage.setItem(ACCESS_TOKEN, token);
  } catch (error) {
    console.error('토큰 저장 중 오류 발생:', error);
  }
};

export const removeAccessToken = () => {
  try {
    localStorage.removeItem(ACCESS_TOKEN);
  } catch (error) {
    console.error('토큰 삭제 중 오류 발생:', error);
  }
};

export function getAccessToken() {
  try {
    return localStorage.getItem(ACCESS_TOKEN);
  } catch (error) {
    console.error('액세스 토큰 조회 오류:', error);
  }
}
