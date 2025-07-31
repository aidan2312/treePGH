import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { CalciteSwitch } from '@esri/calcite-components-react';
import '@esri/calcite-components/dist/components/calcite-switch';
import { CalciteLabel } from '@esri/calcite-components-react';
import { CalciteCard } from '@esri/calcite-components-react';
interface TreeFilterProps {
  treeLayer: FeatureLayer | null;
}

const TreeFilter: React.FC<TreeFilterProps> = ({ treeLayer }) => {
  const [filterVacant, setFilterVacant] = useState(true);
  const switchRef = useRef<HTMLCalciteSwitchElement>(null);

  useEffect(() => {
    if (treeLayer) {
      treeLayer.definitionExpression = filterVacant
        ? "LOWER(common_nam) NOT LIKE '%vacant%'"
        : "";
      console.log("Filter applied:", filterVacant);
      console.log("Layer definition expression:", treeLayer.definitionExpression);
    }
  }, [treeLayer, filterVacant]);

  useEffect(() => {
    if (switchRef.current) {
      switchRef.current.checked = filterVacant;
    }
  }, [filterVacant]);

  const handleChange = () => {
    setFilterVacant(prev => !prev);
  };

  if (!treeLayer) {
    return <div>Error: Tree layer not available</div>;
  }

  return (
    <CalciteCard >
      <CalciteLabel>
        Filter Vacant Trees
        <CalciteSwitch
          scale="s"
          onCalciteSwitchChange={handleChange}
          ref={switchRef}
          label='Filter Vacant Trees'
          name='filter-vacant'

        />
      </CalciteLabel>
    </CalciteCard>
  );
};

export const createTreeFilter = (container: HTMLElement, treeLayer: FeatureLayer | null) => {
  if (!container || !treeLayer) {
    console.error("Container or tree layer is null or undefined");
    return;
  }

  const root = ReactDOM.createRoot(container);
  root.render(<TreeFilter treeLayer={treeLayer} />);
};
