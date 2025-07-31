import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import "@esri/calcite-components/dist/calcite/calcite.css";
import { setAssetPath } from "@esri/calcite-components";
import { defineCustomElements } from "@esri/calcite-components/dist/loader";

// Set the asset path to local assets to avoid CORS issues
setAssetPath("/assets/");

// Define the custom elements
defineCustomElements(window);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)