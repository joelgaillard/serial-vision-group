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
    const margin = { top: 0, right: 100, bottom: 90, left: 100 };
    const width = window.innerWidth - margin.left - margin.right;
    const height = 3000 - margin.top - margin.bottom;

    // Sélection de l'élément SVG container
    const svg = d3.select(".infos-diagram-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Chargement des données sur les tueurs en série
    let data = await loadSerialKillersData();

    // Tri des données du plus grand au plus petit
    data = data.sort((a, b) => b.SerialKillersTotalVictims19922019 - a.SerialKillersTotalVictims19922019);

    // Echelle pour l'axe des abscisses
    const y = d3.scaleBand()
        .domain(data.map(d => d.iso3166_2))
        .range([0, height])
        .padding(0.2);

    // Echelle pour l'axe des ordonnées
    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.SerialKillersTotalVictims19922019)])
        .range([0, width]);


    // Ajout de l'axe des ordonnées
    svg.append("g")
    .call(d3.axisLeft(y).ticks(10))
    .selectAll(".tick line, .domain") // Sélectionne les lignes des ticks et la barre de l'axe
    .style("display", "none"); // Masque les lignes des ticks et la barre de l'axe

        svg.selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => x(d.SerialKillersTotalVictims19922019) + 10)
        .attr("y", d => y(d.iso3166_2) + 20)
        .text(d => d.SerialKillersTotalVictims19922019)
        .style("fill", "white")
        .style("font-size", "12px")
        .style("font-family", "Montserrat");

        svg.selectAll(".tick text") // Sélectionne les textes des ticks
    .attr("fill", "white") // Définit la couleur du texte à blanc
    .style("font-size", "14px") // Définit la taille de la police
    .style("font-weight", "bold"); // Définit le poids de la police à gras


    // Création des barres
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(0))
        .attr("y", d => y(d.iso3166_2)) 
        .attr("width", 0)
        .attr("height", y.bandwidth()) // Hauteur initiale à 0
        .attr("fill", "#ca1414")
        .transition()
        .duration(800)
        .attr("width", d => x(d.SerialKillersTotalVictims19922019)) // Animation de la transition de la hauteur
        .delay((d, i) => i * 100); // Délai progressif pour chaque barre
};



export { displayHexagonMap, displayInfosDiagramme };
