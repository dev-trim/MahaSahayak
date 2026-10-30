import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import AppLayout from './components/AppLayout';
import LandingPage from './pages/LandingPage';
import AssistantPage from './pages/AssistantPage';
import UploadPage from './pages/UploadPage';
import DirectoryPage from './pages/DirectoryPage';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <LanguageProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/directory" element={<DirectoryPage />} />
          </Routes>
        </AppLayout>
      </LanguageProvider>
    </Router>
  </React.StrictMode>
);
