import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import axios from 'axios';
import { API_URL } from './utils/util';

axios.interceptors.request.use((config) => {
  if (config.url && config.url.startsWith(`${API_URL}`)) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (backendUrl) {
      config.url = config.url.replace(`${API_URL}`, backendUrl.replace(/\/$/, ''));
    }
  }
  return config;
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
