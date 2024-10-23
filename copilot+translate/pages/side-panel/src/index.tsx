import { createRoot } from 'react-dom/client';
import '@src/index.css';
import SidePanel from '@src/SidePanel';
import { StrictMode } from 'react';

createRoot(document.getElementById('app-container')!).render(
  <StrictMode>
    <SidePanel />
  </StrictMode>
);