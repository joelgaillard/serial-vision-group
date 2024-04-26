
import * as d3 from 'd3';

document.addEventListener('DOMContentLoaded', function () {
    fetch('/data/ou-se-cachent-ils.json')
        .then(response => response.json())
        .then(data => {
            const grid = document.getElementById('grid');
            data.forEach((stateData) => {
                let hexCell = document.createElement('div');
                hexCell.className = 'hex';
                hexCell.innerHTML = `
                    <div class="hex-content">
                        <span class="state-abbr">${stateData.state.slice(0, 2).toUpperCase()}</span>
                        <span class="details">Victimes: ${stateData.SerialKillersTotalVictims1992 - 2019}</span>
                    </div>
                `;
                grid.appendChild(hexCell);
            });
        })
        .catch(error => console.error('Une erreur est survenue lors du chargement des données:', error));
});

// Créer l'élément SVG
var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("id", "my_dataviz");
svg.setAttribute("width", "440");
svg.setAttribute("height", "300");

// Charger d3.js
var script = document.createElement("script");
script.src = "https://d3js.org/d3.v6.js";

// Attendre que le script soit chargé avant de l'ajouter au DOM
script.onload = function () {
    // Le script est chargé, vous pouvez maintenant ajouter l'élément SVG au DOM
    document.body.appendChild(svg);
};

// Ajouter le script au DOM
document.head.appendChild(script);

// Définition de la fonction pour dessiner la carte
function drawUSMap() {
    // Le SVG
    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    // Projection et carte
    var projection = d3.geoMercator()
        .scale(1000) // C'est le niveau de zoom
        .translate([480, 300]); // Vous devrez peut-être ajuster ces valeurs pour centrer la carte

    // Générateur de chemins
    var path = d3.geoPath()
        .projection(projection);

    // Chargement des données externes et dessin de la carte
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/us_states_hexgrid.geojson.json", function (data) {

        // Dessiner la carte
        svg.append("g")
            .selectAll("path")
            .data(data.features)
            .enter()
            .append("path")
            .attr("fill", "#69a2a2")
            .attr("d", path)
            .attr("stroke", "white");

        // Ajouter les étiquettes
        svg.append("g")
            .selectAll("text")
            .data(data.features)
            .enter()
            .append("text")
            .attr("x", function (d) { return path.centroid(d)[0]; })
            .attr("y", function (d) { return path.centroid(d)[1]; })
            .text(function (d) { return d.properties.iso3166_2; })
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "central")
            .style("font-size", 11)
            .style("fill", "white");
    });
}

// Appel de la fonction pour dessiner la carte une fois que le DOM est chargé
document.addEventListener("DOMContentLoaded", function () {
    drawUSMap();
});

