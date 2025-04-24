import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider.jsx';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ColorModeProvider } from './context/ColorModeProvider.jsx';


// create root
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
      <ColorModeProvider>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
        </ColorModeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
