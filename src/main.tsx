import ReactDOM from 'react-dom/client';
import 'swiper/swiper-bundle.css';
import App from './App';
import './assets/css/fonts.css';
import './assets/css/global.css';
import './assets/css/index.css';
import './assets/css/swiper-custom.css';

window.addEventListener('error', (event) => {
  if (event.message?.includes('Unexpected EOF')) {
    event.preventDefault();
    window.location.reload();
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
