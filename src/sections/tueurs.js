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
            <img src="./assets/img/portraits/${tueur.prenom.toLowerCase()}-${tueur.nom.toLowerCase()}.jpg" alt="${tueur.prenom} ${tueur.nom}" style="max-width: 100%;" width="100%">
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
    photo.src = `/assets/img/portraits/${tueur.prenom.toLowerCase()}-${tueur.nom.toLowerCase()}.jpg`

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

const displayDiagramme = async (id) => {

    d3.select(".diagram-container").select("svg").remove();
    
    // Définition des dimensions et des marges du graphique
    const margin = { top: 10, right: 30, bottom: 90, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    // Sélection de l'élément SVG container
    const svg = d3.select(".diagram-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Chargement des données du tueur en utilisant l'identifiant fourni
    const tueur = await loadKillerById(id);

    // Création d'un objet pour stocker le nombre de victimes par année
    const yearsData = {};
    tueur.victimes.forEach(victim => {
        const year = victim.date;
        if (!yearsData[year]) {
            yearsData[year] = 0;
        }
        yearsData[year]++;
    });

    // Transformation de l'objet en tableau de données exploitable pour le graphique
    const data = Object.keys(yearsData).map(year => ({ year: parseInt(year), victims: yearsData[year] }));

    // Echelle pour l'axe des abscisses
    const x = d3.scaleBand()
        .domain(data.map(d => d.year.toString()))
        .range([0, width])
        .padding(0.2);

    // Echelle pour l'axe des ordonnées
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.victims)])
        .range([height, 0]);

    // Ajout de l'axe des abscisses
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        // .attr("transform", "translate(10,0)")
        // .style("text-anchor", "end");

    // Ajout de l'axe des ordonnées
    svg.append("g")
        .call(d3.axisLeft(y).ticks(d3.max(data, d => d.victims)));

    // Création des barres
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.year.toString()))
        .attr("y", d => y(0)) // Barres commencent à y = 0
        .attr("width", x.bandwidth())
        .attr("height", 0) // Hauteur initiale à 0
        .attr("fill", "#ca1414")
        .transition()
        .duration(800)
        .attr("y", d => y(d.victims)) // Animation de la transition de y
        .attr("height", d => height - y(d.victims)) // Animation de la transition de la hauteur
        .delay((d, i) => i * 100); // Délai progressif pour chaque barre
};

const displayCarte = async (id) => {
    const chart = Choropleth(unemployment, {
        id: d => d.id,
        value: d => d.rate,
        scale: d3.scaleQuantize,
        domain: [1, 10],
        range: d3.schemeBlues[9],
        title: (f, d) => `${f.properties.name}, ${statemap.get(f.id.slice(0, 2)).properties.name}\n${d?.rate}%`,
        features: counties,
        borders: statemesh,
        width: 975,
        height: 610
      })
}





export {displayKillers, displayKiller, displayDiagramme, displayCarte}