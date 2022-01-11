import React from 'react'
import { render } from 'react-dom'
import './index.css'
import App from './App'
import { Buffer } from 'buffer';

if (window.Buffer === undefined) {
  window.Buffer = Buffer;
}

render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
