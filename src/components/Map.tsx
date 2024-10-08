import React, { useEffect, useRef, useState, useMemo } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import esriConfig from "@arcgis/core/config";
import "@arcgis/core/assets/esri/themes/dark/main.css";
import Basemap from "@arcgis/core/Basemap";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import Search from "@arcgis/core/widgets/Search";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol.js";
import { fetchWikipediaImage } from "../utilities";
import './Map.css';

interface MapFrameProps {
    center?: [number, number];
    zoom?: number;
}

export const MapFrame: React.FC<MapFrameProps> = React.memo(({
    center = [-79.9959, 40.4406], // Pittsburgh, PA coordinates
    zoom = 12
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<MapView | null>(null);
    const layerRef = useRef<GeoJSONLayer | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [filterVacant, setFilterVacant] = useState<boolean>(false);
    const handleFilterChange = () => {
        setFilterVacant(!filterVacant);
    };

    // Check API key early
    const apiKey = import.meta.env.VITE_ARCGIS_API_KEY;
    if (!apiKey) {
        setError("ArcGIS API key is not set in environment variables");
    }

    // Memoize popup template
    const popupTemplate = useMemo(() => new PopupTemplate({
        title: "{common_name}",
        content: [
            {
                type: "fields",
                fieldInfos: [
                    { fieldName: "scientific_name", label: "Scientific Name" },
                    { fieldName: "diameter_base_height", label: "Diameter (inches)", format: { digitSeparator: true, places: 1 } },
                    { fieldName: "height", label: "Height (ft)", format: { digitSeparator: true, places: 1 } },
                    { fieldName: "condition", label: "Condition" }
                ]
            },
            { type: "text", text: "<b>Environmental Benefits</b>" },
            {
                type: "fields",
                fieldInfos: [
                    { fieldName: "co2_benefits_totalco2_lbs", label: "Total CO2 Benefits (lbs)", format: { digitSeparator: true, places: 0 } },
                    { fieldName: "air_quality_benfits_total_lbs", label: "Total Air Quality Benefits (lbs)", format: { digitSeparator: true, places: 2 } },
                    { fieldName: "stormwater_benefits_runoff_elim", label: "Stormwater Runoff Eliminated (gal)", format: { digitSeparator: true, places: 0 } }
                ]
            },
            { type: "text", text: "<b>Economic Benefits</b>" },
            {
                type: "fields",
                fieldInfos: [
                    { fieldName: "overall_benefits_dollar_value", label: "Total Benefits ($)", format: { digitSeparator: true, places: 2 } },
                    { fieldName: "energy_benefits_electricity_dollar_value", label: "Energy Savings - Electricity ($)", format: { digitSeparator: true, places: 2 } },
                    { fieldName: "energy_benefits_gas_dollar_value", label: "Energy Savings - Gas ($)", format: { digitSeparator: true, places: 2 } }
                ]
            },
            {
                type: "custom",
                creator: async function (feature: any) {
                    const scientificName = feature.graphic.attributes.scientific_name;
                    const imgUrl = await fetchWikipediaImage(scientificName);
                    if (imgUrl) {
                        return `<img src="${imgUrl}" alt="${scientificName}" style="max-width: 100%; height: auto;"><p>Image source: Wikipedia</p>`;
                    } else {
                        return `<p>No image available for ${scientificName}</p>`;
                    }
                }
            }
        ],
        overwriteActions: true,
    }), []);

    // Memoize tree renderer
    const treeRenderer = useMemo(() => {
        const treeFillSymbol = new SimpleMarkerSymbol({
            color: "rgba(0, 100, 0, 1)", // dark green
            size: "12px",
            outline: {
                color: "rgba(0, 50, 0, 0.5)", // half-transparent darker green for outline
                width: 5
            }
        });
        return new SimpleRenderer({ symbol: treeFillSymbol });
    }, []);

    useEffect(() => {
        if (layerRef.current) {
            if (filterVacant) {
                layerRef.current.definitionExpression = "LOWER(common_name) NOT LIKE '%vacant%'";
            } else {
                layerRef.current.definitionExpression = "";
            }
        }
    }, [filterVacant]);
    // Initialize map and view
    useEffect(() => {
        if (!apiKey || !mapRef.current || viewRef.current) return;

        esriConfig.apiKey = apiKey;
        esriConfig.request.useIdentity = false;
        esriConfig.request.timeout = 60000;

        const map = new Map({
            basemap: Basemap.fromId("dark-gray-vector")
        });

        const treeLayer = new GeoJSONLayer({
            url: "/trees.geojson",
            popupTemplate: popupTemplate,
            outFields: ["common_name"],
            copyright: "Aidan A. Donnelly",
            renderer: treeRenderer,
            featureReduction: {
                type: "cluster",
                clusterRadius: "50px",
            }
        });
        layerRef.current = treeLayer;

        map.add(treeLayer);

        viewRef.current = new MapView({
            container: mapRef.current,
            map: map,
            zoom: zoom,
            center: center,
            popup: {
                dockEnabled: true,
                dockOptions: {
                    buttonEnabled: false,
                    breakpoint: false,
                    position: "top-right",
                }
            }
        });

        const searchWidget = new Search({ view: viewRef.current });

        viewRef.current.when(() => {
            console.log("MapView ready");
            viewRef.current?.ui.add(searchWidget, { position: "top-right" });
        }, (error: any) => {
            console.error("MapView failed to load", error);
            setError(`Failed to load map: ${error.name} - ${error.message}`);
        });

        return () => {
            if (viewRef.current) {
                viewRef.current.destroy();
                viewRef.current = null;
            }
        };
    }, [apiKey, center, zoom, popupTemplate, treeRenderer]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (viewRef.current && mapRef.current) {
                viewRef.current.container = mapRef.current;
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div
            ref={mapRef}
            style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }}
        >
            <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                backgroundColor: 'white',
                padding: '10px',
                borderRadius: '5px',
                zIndex: 1000
            }}>
                <label>
                    <input
                        type="checkbox"
                        checked={filterVacant}
                        onChange={handleFilterChange}
                    />
                    Filter out vacant trees
                </label>
            </div>
        </div>
    );
});

MapFrame.displayName = "MapFrame";