import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/fonts.css';

const AppWithStrictMode = <App />;

ReactDOM.createRoot(document.getElementById('root')!).render(AppWithStrictMode);
