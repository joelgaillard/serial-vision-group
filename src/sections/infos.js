import * as d3 from 'd3';

import { loadHexagonMap, loadSerialKillersData } from '../load-datas.js';

const displayHexagonMap = async () => {
    const hexagonData = await loadHexagonMap();
    const serialKillersData = await loadSerialKillersData();

    const svg = d3.select("#hexagon-map"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    const projection = d3.geoMercator()
        .fitExtent([[0, 0], [width, height]], hexagonData);

    const path = d3.geoPath()
        .projection(projection);

    const maxVictims = d3.max(serialKillersData, d => d.SerialKillersTotalVictims19922019);

    const colorScale = d3.scaleLog()
    .domain([1, maxVictims]) // Assurez-vous d'avoir défini maxVictims
    .range(["#ffffff", "#ca1414"]) // Utilisez les nouvelles couleurs
    .interpolate(d3.interpolateHcl); // Utilisez l'interpolation pour des transitions plus douces

    svg.append("g")
        .selectAll("path")
        .data(hexagonData.features)
        .join("path")
            .attr("fill", d => {
                const stateData = serialKillersData.find(state => state.iso3166_2 === d.properties.iso3166_2);
                if (stateData) {
                    return colorScale(stateData.SerialKillersTotalVictims19922019);
                } else {
                    return "gray";
                }
            })
            .attr("d", path)
            .attr("stroke", "#272727");

    svg.append("g")
        .selectAll("labels")
        .data(hexagonData.features)
        .join("text")
            .attr("x", d => path.centroid(d)[0])
            .attr("y", d => path.centroid(d)[1])
            .text(d => d.properties.iso3166_2)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "central")
            .style("font-size", 11)
            .style("fill", "white")
            .style("font-family", "Montserrat"); 
}

const displayInfosDiagramme = async () => {

    d3.select(".infos-diagram-container").select("svg").remove();

    // Définition des dimensions et des marges du graphique
    const margin = { top: 10, right: 30, bottom: 90, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    // Sélection de l'élément SVG container
    const svg = d3.select(".infos-diagram-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Chargement des données sur les tueurs en série
    const data = await loadSerialKillersData();

    console.log(data)

    // Echelle pour l'axe des abscisses
    const x = d3.scaleBand()
        .domain(data.map(d => d.iso3166_2))
        .range([0, width])
        .padding(0.2);

    // Echelle pour l'axe des ordonnées
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.SerialKillersTotalVictims19922019)])
        .range([height, 0]);

    // Ajout de l'axe des abscisses
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("font-size", "12px");

    // Ajout de l'axe des ordonnées
    svg.append("g")
        .call(d3.axisLeft(y).ticks(10))
        .selectAll("text")
        .attr("font-size", "12px");

    // Création des barres
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.iso3166_2))
        .attr("y", d => y(0)) // Barres commencent à y = 0
        .attr("width", x.bandwidth())
        .attr("height", 0) // Hauteur initiale à 0
        .attr("fill", "#ca1414")
        .transition()
        .duration(800)
        .attr("y", d => y(d.SerialKillersTotalVictims19922019)) // Animation de la transition de y
        .attr("height", d => height - y(d.SerialKillersTotalVictims19922019)) // Animation de la transition de la hauteur
        .delay((d, i) => i * 100); // Délai progressif pour chaque barre
};


export { displayHexagonMap, displayInfosDiagramme };
