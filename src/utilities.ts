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
