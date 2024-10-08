import { useEffect } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import {
  CalciteShell,
  CalciteNavigation,
  CalciteNavigationLogo,
  CalciteMenu,
  CalciteMenuItem,
} from '@esri/calcite-components-react';
import { MapFrame } from './components/Map';
import { About } from './components/About';
// Placeholder components for routes


function App() {
  useEffect(() => {
    document.body.classList.add('calcite-mode-dark');
  }, []);




  return (
    <CalciteShell>
      <CalciteNavigation slot="header">
        <CalciteNavigationLogo
          thumbnail="/pgh-nobg.svg"
          slot="logo"
          heading="pghTrees"
          description="Pittsburgh in Trees"

        />
        <CalciteMenu slot="content-start" label='Navigation'>
          <Link to="/">
            <CalciteMenuItem text='Home' label="Home" icon-start="map" />
          </Link>

          <Link to="/about" >
            <CalciteMenuItem text='About' label="About" icon-start="information" />
          </Link>
        </CalciteMenu>
      </CalciteNavigation>
      <div style={{}}>
        <Routes>
          <Route path="/" element={<MapFrame />} />

          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </CalciteShell>
  );
}

export default App;