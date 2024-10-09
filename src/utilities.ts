import PopupTemplate from "@arcgis/core/PopupTemplate";

export const fetchWikipediaImage = async (
  scientificName: string
): Promise<string | null> => {
  const formattedName = encodeURIComponent(scientificName.replace(" ", "_"));
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${formattedName}&prop=pageimages&format=json&pithumbsize=300&origin=*`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    return pages[pageId].thumbnail?.source || null;
  } catch (error) {
    console.error("Error fetching Wikipedia image:", error);
    return null;
  }
};

export const fetchDataFromWikipedia = async (
  scientificName: string
): Promise<string | null> => {
  const formattedName = encodeURIComponent(scientificName.replace(" ", "_"));
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${formattedName}&prop=extracts&format=json&exintro=1&origin=*`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    return pages[pageId].extract || null;
  } catch (error) {
    console.error("Error fetching Wikipedia data:", error);
    return null;
  }
};
export function createPopupTemplate() {
  return new PopupTemplate({
    title: "{common_name}",
    content: [
      {
        type: "fields",
        fieldInfos: [
          { fieldName: "scientific_name", label: "Scientific Name" },
          {
            fieldName: "diameter_base_height",
            label: "Diameter (inches)",
            format: { digitSeparator: true, places: 1 },
          },
          {
            fieldName: "height",
            label: "Height (ft)",
            format: { digitSeparator: true, places: 1 },
          },
          { fieldName: "condition", label: "Condition" },
        ],
      },
      { type: "text", text: "<b>Environmental Benefits</b>" },
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "co2_benefits_totalco2_lbs",
            label: "Total CO2 Benefits (lbs)",
            format: { digitSeparator: true, places: 0 },
          },
          {
            fieldName: "air_quality_benfits_total_lbs",
            label: "Total Air Quality Benefits (lbs)",
            format: { digitSeparator: true, places: 2 },
          },
          {
            fieldName: "stormwater_benefits_runoff_elim",
            label: "Stormwater Runoff Eliminated (gal)",
            format: { digitSeparator: true, places: 0 },
          },
        ],
      },
      { type: "text", text: "<b>Economic Benefits</b>" },
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "overall_benefits_dollar_value",
            label: "Total Benefits ($)",
            format: { digitSeparator: true, places: 2 },
          },
          {
            fieldName: "energy_benefits_electricity_dollar_value",
            label: "Energy Savings - Electricity ($)",
            format: { digitSeparator: true, places: 2 },
          },
          {
            fieldName: "energy_benefits_gas_dollar_value",
            label: "Energy Savings - Gas ($)",
            format: { digitSeparator: true, places: 2 },
          },
        ],
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
        },
      },
      {
        type: "custom",
        creator: async function (feature: any) {
          const scientificName = feature.graphic.attributes.scientific_name;
          const wikipediaData = await fetchDataFromWikipedia(scientificName);
          if (wikipediaData) {
            return (
              wikipediaData +
              `<p>Source: <a href="https://en.wikipedia.org/wiki/${scientificName}" target="_blank">Wikipedia</a></p>`
            );
          } else {
            return `<p>No Wikipedia data available for ${scientificName}</p>`;
          }
        },
      },
    ],
    overwriteActions: true,
  });
}
