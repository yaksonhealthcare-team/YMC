import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react';
import { ReactNode } from 'react';
import { Button } from '@/shared/ui/button/Button';

const ErrorFallback = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">죄송합니다</h1>
      <p className="text-gray-600 mb-6">예상치 못한 오류가 발생했습니다.</p>
      <div className="flex gap-2">
        <Button onClick={() => (window.location.href = '/')}>홈으로 이동</Button>
        <Button variantType="line" onClick={handleReload}>
          페이지 새로고침
        </Button>
      </div>
    </div>
  );
};

interface ErrorBoundaryProps {
  children: ReactNode;
}

const ErrorBoundary = ({ children }: ErrorBoundaryProps) => {
  return <SentryErrorBoundary fallback={ErrorFallback}>{children}</SentryErrorBoundary>;
};

export default ErrorBoundary;
