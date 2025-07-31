import React, { useRef, useEffect } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import esriConfig from "@arcgis/core/config";
import "@arcgis/core/assets/esri/themes/dark/main.css";
import Basemap from "@arcgis/core/Basemap";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Search from "@arcgis/core/widgets/Search";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol.js";
import { createTreeFilter } from "./TreeFilter";
import { createPopupTemplate } from "../utilities";
import './Map.css';

interface MapFrameProps {
    center?: [number, number];
    zoom?: number;
}

export const MapFrame: React.FC<MapFrameProps> = ({
    center = [-79.9959, 40.4406], // Pittsburgh, PA coordinates
    zoom = 12
}) => {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const apiKey = import.meta.env.VITE_ARCGIS_API_KEY;
        if (!apiKey) {
            console.error("ArcGIS API key is not set in environment variables");
            return;
        }

        esriConfig.apiKey = apiKey;
        esriConfig.request.useIdentity = false;
        esriConfig.request.timeout = 60000;

        const map = new Map({
            basemap: Basemap.fromId("dark-gray-vector")
        });

        const popupTemplate = createPopupTemplate();

        const treeRenderer = new SimpleRenderer({
            symbol: new SimpleMarkerSymbol({
                color: "rgba(0, 100, 0, 1)",
                size: "12px",
                outline: {
                    color: "rgba(0, 50, 0, 0.5)",
                    width: 5
                }
            })
        });

        const treeLayer = new FeatureLayer({
            url: "https://services9.arcgis.com/IdGOTokL4xNwFJF6/arcgis/rest/services/trees/FeatureServer/0",
            popupTemplate: popupTemplate,
            copyright: "Aidan A. Donnelly",
            renderer: treeRenderer,
        });

        map.add(treeLayer);

        const view = new MapView({
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

        const searchWidget = new Search({ view: view });

        view.when(() => {
            console.log("MapView ready");
            view.ui.add(searchWidget, { position: "top-right" });

            // Create a container for the TreeFilter
            const filterContainer = document.createElement('div');
            view.ui.add(filterContainer, 'top-left');

            // Render the TreeFilter React component
            try {
                createTreeFilter(filterContainer, treeLayer);
                console.log("TreeFilter added to the map");
            } catch (error) {
                console.error("Error creating TreeFilter:", error);
            }
        }, (error: any) => {
            console.error("MapView failed to load", error);
        });

        return () => {
            if (view) {
                view.destroy();
            }
        };
    }, [center, zoom]);

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
        />
    );
};

MapFrame.displayName = "MapFrame";

