import { Button } from '@/_shared';

function getMobileOS(): 'Android' | 'iOS' | 'Other' {
  const ua = navigator.userAgent || navigator.vendor;
  if (/android/i.test(ua)) return 'Android';
  if (/iPad|iPhone|iPod/.test(ua)) return 'iOS';
  return 'Other';
}

const ErrorPage2 = () => {
  const os = getMobileOS();

  const storeUrl =
    os === 'Android'
      ? 'https://play.google.com/store/apps/details?id=com.yaksonhc.therapist'
      : os === 'iOS'
        ? 'https://apps.apple.com/us/app/therapist-%EC%95%BD%EC%86%90%EB%AA%85%EA%B0%80/id6739484377'
        : '/'; // fallback URL 또는 홈페이지

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">죄송합니다</h1>
      <p className="text-gray-500 text-sm mb-6">이전 버전을 사용중입니다. 스토어에서 앱 업데이트 부탁드립니다.</p>
      <div className="flex gap-2">
        <Button onClick={() => (window.location.href = storeUrl)}>스토어로 이동</Button>
      </div>
    </div>
  );
};

export default ErrorPage2;
