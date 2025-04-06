import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Polyfill for React Router's v7_startTransition
// This helps silence the warning about future transition behavior
if (!React.startTransition) {
  React.startTransition = (callback) => {
    callback();
  };
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful');
      })
      .catch((err) => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 