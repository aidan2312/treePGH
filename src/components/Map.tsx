import React, { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import esriConfig from "@arcgis/core/config";
import "@arcgis/core/assets/esri/themes/dark/main.css";
import Basemap from "@arcgis/core/Basemap";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import Search from "@arcgis/core/widgets/Search";
import { CalciteLoader } from "@esri/calcite-components-react";

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
    const [error, setError] = useState<string | null>(null);
    const [layersLoading, setLayersLoading] = useState<boolean>(true);


    useEffect(() => {
        const popupTemplate = new PopupTemplate({
            title: "Tree Information",
            content: [{
                type: "fields",
                fieldInfos: [{
                    fieldName: "common_name",
                    label: "Common Name"
                }]
            }],
        });



        const treeLayer = new GeoJSONLayer({
            url: "/trees.geojson",
            popupTemplate: popupTemplate,
            outFields: ["common_name"],
            copyright: "Aidan A. Donnelly",

        });

        const apiKey = import.meta.env.VITE_ARCGIS_API_KEY;
        console.log("API Key (first 10 chars):", apiKey?.substring(0, 10));

        if (!apiKey) {
            setError("ArcGIS API key is not set in environment variables");
            return;
        }

        esriConfig.apiKey = apiKey;
        esriConfig.request.useIdentity = false;
        esriConfig.request.timeout = 60000;
        console.log("esriConfig setup complete:", esriConfig);




        if (mapRef.current && !viewRef.current) {
            const map = new Map({
                basemap: Basemap.fromId("dark-gray-vector")
            });

            map.add(treeLayer); // Add the tree layer to the map

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
                        position: "top-right"
                    }

                }
            });

            const searchWidget = new Search({
                view: viewRef.current
            });
            viewRef.current.when(() => {

                console.log("MapView ready");
                viewRef.current?.ui.add(searchWidget, {
                    position: "top-right"
                });
            }, (error: any) => {
                console.error("MapView failed to load", error);
                setError(`Failed to load map: ${error.name} - ${error.message}`);
            });


        }

        return () => {
            if (viewRef.current) {
                viewRef.current.destroy();
                viewRef.current = null;
            }
        };
    }, [center, zoom]);

    useEffect(() => {
        const handleResize = () => {
            if (viewRef.current && mapRef.current) {
                viewRef.current.container = mapRef.current;
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
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

        </>
    );
});

MapFrame.displayName = "MapFrame";