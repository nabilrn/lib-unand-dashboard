
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { LocaleProvider } from './i18n/LocaleContext';
import App from './App';
import './index.css';

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename={basename}>
    <LocaleProvider>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </LocaleProvider>
  </BrowserRouter>
);
  
