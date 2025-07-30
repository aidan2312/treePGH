
# treePGH
### A comprehensive tree inventory for the City of Pittsburgh

treePGH utilizes Esri's Calcite design system and the ArcGIS Maps SDK for JavaScript to visualize and provide information on tree data (provided by the Western PA Regional Data Center) within the City of Pittsburgh.






## Authors

- [Aidan Donnelly (@aidan2312)](https://www.github.com/aidan2312)
## Technology Used

 - [Calcite Components]("https://https://developers.arcgis.com/calcite-design-system/components/")
 - [ArcGIS Maps SDK for JavaScript]("https://developers.arcgis.com/javascript/latest/")
 - React
 - TypeScript
 - Vite



## Host it yourself

My .env is included for demo purposes only and the key included is a sample - I would not recommend using it.

First you'll need an ArcGIS API key to access the ArcGIS Maps SDK for JavaScript.  [More about that here.]("https://developers.arcgis.com/documentation/security-and-authentication/api-key-authentication/")  If you don't have access to ArcGIS, you could swap out the ArcGIS Maps SDK components for OpenLayers or MapBox.

Clone this repo:
```bash
git clone https://github.com/aidan2312/treePGH
```

Install dependencies
```bash
npm i
```
After acquiring an API key, copy it into .env as VITE_ARCGIS_API_KEY

Run!
```bash
npm run dev
```





## Environment Variables

`VITE_ARCGIS_API_KEY` Your API key (see above).




## License

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)



