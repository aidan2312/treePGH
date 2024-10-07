import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import "@esri/calcite-components/dist/calcite/calcite.css";
import { defineCustomElements } from "@esri/calcite-components/dist/loader";

// Local assets
defineCustomElements(window, {
  resourcesUrl: "https://unpkg.com/@esri/calcite-components/dist/calcite/assets"
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)