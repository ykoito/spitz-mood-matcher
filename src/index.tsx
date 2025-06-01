import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // 使ってなければ削除してもOK
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);