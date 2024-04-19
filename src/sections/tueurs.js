import { loadKillers, loadKillerById } from "../load-datas";

import { Chart } from 'chart.js';

import * as d3 from 'd3';

const displayKillers = (url) => {
    const photoContainer = document.querySelector(".photo-grid");
photoContainer.innerHTML = "";
loadKillers().then((tueurs) => {
        tueurs.forEach(tueur => {

            const html = `
            <div class="photo-item">
            <a href="#tueurs-${tueur.id}" class="photo-link">
            <img src="./assets/img/${tueur.prenom.toLowerCase()}-${tueur.nom.toLowerCase()}.jpg" alt="${tueur.prenom} ${tueur.nom}" style="max-width: 100%;" width="100%">
      <div class="photo-title">${tueur.prenom.toUpperCase()} ${tueur.nom.toUpperCase()}</div>
    </a>
  </div>`;
            photoContainer.innerHTML += html;
        });
    })
}

const afficheInfosTueur = (tueur) => {
    const titre = document.querySelector("#tueur-section h1");
    const photo = document.querySelector(".photo");
    const blocTexte = document.querySelector(".text-lines");

    titre.innerHTML = `${tueur.nom} ${tueur.prenom}`;
    photo.src = `/assets/img/${tueur.prenom.toLowerCase()}-${tueur.nom.toLowerCase()}.jpg`

    blocTexte.innerHTML = "";    
        
    if (!!tueur.surnom) {
        const surnom = document.createElement("p");
        surnom.classList.add("surnom")
        surnom.textContent = `Surnom: ${tueur.surnom} `;
        blocTexte.appendChild(surnom)
    }

    const nbrVictimes = tueur.victimes.length;
    const victimes = document.createElement("p");
    victimes.classList.add("nombre-victimes");
    victimes.textContent = `${nbrVictimes} victimes`;
    blocTexte.appendChild(victimes)

    const peine = document.createElement("p");
    peine.classList.add("peine");
    peine.textContent = `Peine: ${tueur.peine_encourue}`;
    blocTexte.appendChild(peine)

    if (tueur.mort) {
        const mort = document.createElement("p");
        mort.classList.add("mort")
        mort.textContent = `Décès: ${tueur.moyen_execution}`;
        blocTexte.appendChild(mort)
    }
}

const displayKiller = async (id) => {
    const tueur = await loadKillerById(id);
    afficheInfosTueur(tueur)
}

// Affichage du diagramme à barres
const displayDiagramme = async (id) => {
    // Efface le contenu précédent du conteneur
    document.querySelector(".diagram-container").innerHTML = "";

    // Définition des marges et des dimensions du graphique
    const margin = { top: 30, right: 30, bottom: 30, left: 30 };
    const width = 300 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    // Chargement des données du tueur
    const data = await loadKillerById(id);

    // Extraction des années et calcul du nombre de victimes par année
    const yearsData = {};
    data.victimes.forEach(victim => {
        const year = victim.date;
        if (!yearsData[year]) {
            yearsData[year] = 0;
        }
        yearsData[year]++;
    });

    // Conversion des données en tableau d'objets pour D3
    const myData = Object.keys(yearsData).map(year => ({ year: parseInt(year), victims: yearsData[year] }));

    // Ajout du conteneur SVG
    const monSvg = d3.select(".diagram-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("background-color", "lightgrey")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Echelles pour les axes
    const xScale = d3.scaleBand()
    .domain(myData.map(d => d.year))
    .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(myData, d => d.victims)])
        .range([height, 0]);

    // Largeur fixe des rectangles
// Calculer la largeur disponible pour chaque rectangle
const barSpacing = 15; // Définissez l'espace blanc souhaité entre chaque rectangle
const barWidth = 40; // Largeur fixe des rectangles

// Dessiner les rectangles
monSvg.selectAll('rect')
    .data(myData)
    .enter()
    .append('rect')
    .attr('x', (d, i) => (i * (barWidth + barSpacing))) // Ajoutez l'espace blanc entre chaque rectangle
    .attr('y', d => yScale(d.victims))
    .attr('width', barWidth)
    .attr('height', d => height - yScale(d.victims))
    .attr('fill', 'darkred');

// Dessiner les axes
const xAxis = d3.axisBottom(xScale);
monSvg.append('g')
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text") // Sélectionne tous les textes sur l'axe des X
    .style("text-anchor", "middle") // Centre le texte
    .attr("x", (d, i) => (i * (barWidth + barSpacing)) + (barWidth / 2) + margin.left) // Ajuste la position horizontale du texte pour le centrer sous chaque rectangle
    .attr("y", "1em"); // Place le texte en dessous des rectangles

// Dessiner les axes
const yAxis = d3.axisLeft(yScale)
    .ticks(d3.max(myData, d => d.victims)); // Limite le nombre de graduations sur l'axe Y
monSvg.append('g')
    .call(yAxis);
};





export {displayKillers, displayKiller, displayDiagramme}