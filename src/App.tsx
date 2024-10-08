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
          <Link to="/about">
            <CalciteMenuItem text='About' label="About" icon-start="information" />
          </Link>
          <Link to="https://github.com/aidan2312" target='_blank'>
            <CalciteMenuItem text='Github' label="Github" icon-start="code-branch" />


          </Link>
        </CalciteMenu>
        {/* <CalciteNavigationUser slot="content-end" fullName="Aidan A. Donnelly" thumbnail="" label='User'>

        </CalciteNavigationUser> */}
      </CalciteNavigation>

      <div>
        <Routes>
          <Route path="/" element={<MapFrame />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </CalciteShell>
  );
}

export default App;