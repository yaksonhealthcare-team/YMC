import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/css/index.css';
import './assets/css/fonts.css';
import './assets/css/global.css';

const AppWithStrictMode = <App />;

ReactDOM.createRoot(document.getElementById('root')!).render(AppWithStrictMode);
