import { SpeedInsights } from '@vercel/speed-insights/react';
import ReactDOM from 'react-dom/client';
import 'swiper/swiper-bundle.css';
import App from './App';
import './styles/fonts.css';
import './styles/global.css';
import './styles/index.css';
import './styles/swiper-custom.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <App />
    <SpeedInsights />
  </>,
);
