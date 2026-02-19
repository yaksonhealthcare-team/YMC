import ReactDOM from 'react-dom/client';
import 'swiper/swiper-bundle.css';
import App from './App';
import './assets/css/fonts.css';
import './assets/css/global.css';
import './assets/css/index.css';
import './assets/css/swiper-custom.css';

// iOS WKWebView에서 chunk 로드 실패 시 global SyntaxError로 발생하는 케이스 처리
// (Chrome/Firefox는 import() Promise rejection으로 처리되지만 WKWebView는 window.onerror로 발생)
window.addEventListener('error', (event) => {
  const isChunkSyntaxError =
    event.error instanceof SyntaxError ||
    event.message?.includes('Unexpected EOF') ||
    event.message?.includes('Unexpected token');

  if (isChunkSyntaxError) {
    const RELOAD_KEY = 'chunkErrorReloaded';
    const reloadCount = parseInt(sessionStorage.getItem(RELOAD_KEY) || '0');
    if (reloadCount < 2) {
      sessionStorage.setItem(RELOAD_KEY, String(reloadCount + 1));
      window.location.reload();
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
