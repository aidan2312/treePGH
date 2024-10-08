import { CalciteCard, CalciteChip, CalciteLink } from "@esri/calcite-components-react";





export const About = () => {
    return (
        <>
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>About pghTrees</h1>

                <CalciteCard style={{ marginBottom: '1.5rem' }}>
                    <span slot="heading">Project Overview</span>
                    <span slot="description">
                        This project visualizes tree data for the city of Pittsburgh, providing insights into the urban forest landscape. Our interactive map allows users to explore the distribution and characteristics of trees across the city.
                    </span>
                    <div slot="footer-end">
                        <CalciteChip icon="map" value={undefined}>Interactive Map</CalciteChip>
                    </div>
                </CalciteCard>

                <CalciteCard style={{ marginBottom: '1.5rem' }}>
                    <span slot="heading">Data Collection</span>
                    <span slot="description">
                        The tree data displayed in this project was collected between 2020 and 2022. This comprehensive dataset offers a recent snapshot of Pittsburgh's urban forest.
                    </span>
                    <div slot="footer-end">
                        <CalciteChip icon="calendar" value={undefined}>2020-2022</CalciteChip>
                    </div>
                </CalciteCard>

                <CalciteCard style={{ marginBottom: '1.5rem' }}>
                    <span slot="heading">Data Source</span>
                    <span slot="description">
                        Ever grateful to the Western PA Regional Data Center (WPRDC) for providing the data used in this project. WPRDC is a valuable resource for open data in the Western Pennsylvania region.

                    </span>
                    <div slot="footer-end">
                        <CalciteLink href="https://wprdc" target="_blank" rel="noopener noreferrer">Learn more about WPRDC</CalciteLink>
                    </div>
                    <div slot="footer-start">

                        <CalciteChip icon="list" value={undefined}>WPRDC</CalciteChip>

                    </div>
                </CalciteCard>

                <CalciteCard>
                    <span slot="heading">Technology Stack</span>
                    <span slot="description">
                        This project leverages cutting-edge mapping and UI technologies:
                        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li>ArcGIS Maps SDK for JavaScript (Esri): Powers the interactive mapping capabilities</li>
                            <li>Calcite Components (Esri): Provides a cohesive and user-friendly interface design</li>
                        </ul>
                    </span>
                    <div slot="footer-start">
                        <CalciteChip icon="map" value={undefined}>ArcGIS Maps SDK</CalciteChip>
                    </div>
                    <div slot="footer-end">
                        <CalciteChip icon="code" value={undefined}>Calcite Components</CalciteChip>
                    </div>

                </CalciteCard>
                <p style={{ textAlign: 'center' }}>&copy; 2022 Aidan A. Donnelly</p>
            </div>

        </>
    );
};

export default About;