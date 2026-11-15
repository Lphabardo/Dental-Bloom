import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AdminPage } from './pages/AdminPage';
import { loadRemoteLessons } from './features/lessons/remoteLessons'; loadRemoteLessons();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {window.location.hash.startsWith('#admin') ? <AdminPage /> : <App />}
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js');
  });
}