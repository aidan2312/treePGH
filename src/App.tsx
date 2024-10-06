import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import {
  CalciteShell,
  CalciteNavigation,
  CalciteNavigationLogo,
  CalciteMenu,
  CalciteMenuItem,
} from '@esri/calcite-components-react';
import { MapFrame } from './components/Map';


// Placeholder components for routes
const Home = () => <h1>Home Page</h1>;
const Trees = () => <MapFrame />;
const About = () => <h1>About Page</h1>;

function App() {
  useEffect(() => {
    document.body.classList.add('calcite-mode-dark');
  }, []);

  return (
    <Router>
      <CalciteShell>
        <CalciteNavigation slot="header">
          <CalciteNavigationLogo
            slot="logo"
            heading="pghTrees"
            description="See Trees"
          />
          <CalciteMenu slot="content-start" label='Navigation'>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <CalciteMenuItem text='Home' label="Home" icon-start="home" text-enabled />
            </Link>
            <Link to="/trees" style={{ textDecoration: 'none' }}>
              <CalciteMenuItem text='Map' label="Map" icon-start="map" text-enabled />
            </Link>
            <Link to="/about" style={{ textDecoration: 'none' }}>
              <CalciteMenuItem text='About' label="About" icon-start="information" text-enabled />
            </Link>
          </CalciteMenu>
        </CalciteNavigation>
        <div style={{}}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trees" element={<Trees />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </CalciteShell>
    </Router>
  );
}

export default App;