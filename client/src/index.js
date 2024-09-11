import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Optional: if you have CSS styling
import App from './app'; // Assuming you have an App.js component in the same directory

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);