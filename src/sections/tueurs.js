import { loadKillers, loadKillerById, loadMap } from "../load-datas";

import * as d3 from 'd3';

const displayKillers = (url) => {
    const photoContainer = document.querySelector(".photo-grid");
    photoContainer.innerHTML = "";
    loadKillers().then((tueurs) => {
        tueurs.forEach(tueur => {

            const html = `
            <div class="photo-item">
            <a href="#tueurs-${tueur.id}" class="photo-link">
            <img src="./assets/img/portraits/${tueur.portrait}" alt="${tueur.prenom} ${tueur.nom}" style="max-width: 100%;" width="100%">
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
    photo.src = `/assets/img/portraits/${tueur.portrait}`

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
    const width = 800 - margin.left - margin.right;
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
    .selectAll(".tick line") // Sélectionne les lignes des ticks
    .style("display", "none"); // Masque les lignes des ticks

svg.selectAll(".domain") // Sélectionne la ligne de l'axe (la barre)
    .style("display", "none"); // Masque la ligne de l'axe

svg.selectAll(".tick text") // Sélectionne les textes des ticks
    .attr("fill", "white"); // Définit la couleur du texte à blanc


    // .attr("transform", "translate(10,0)")
    // .style("text-anchor", "end");

    // Ajout de l'axe des ordonnées
    svg.append("g")
    .call(d3.axisLeft(y).ticks(d3.max(data, d => d.victims)))
    .selectAll(".tick line") // Sélectionne les lignes des ticks
    .style("display", "none"); // Masque les lignes des ticks

svg.selectAll(".domain") // Sélectionne la ligne de l'axe (la barre)
    .style("display", "none"); // Masque la ligne de l'axe

    svg.selectAll(".tick text") // Sélectionne les textes des ticks
    .attr("fill", "white") // Définit la couleur du texte à blanc
    .style("font-size", "14px") // Définit la taille de la police
    .style("font-weight", "bold"); // Définit le poids de la police à gras
// Définit la couleur du texte à blanc

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
        const geographicData = await loadMap();
        const tueur = await loadKillerById(id);
        const stateData = {};

        tueur.victimes.forEach(victim => {
            const state = victim.lieu;
            const nbVictims = 1; 
            if (!stateData[state]) {
                stateData[state] = { state: state, nbvictims: nbVictims, victims: [] };
            } else {
                stateData[state].nbvictims += nbVictims;
            }
            stateData[state].victims.push(victim);
        });

        const dataArray = Object.values(stateData);
        console.warn(dataArray);

        const margin = { top: 10, right: 40, bottom: 30, left: 40 },
            width = 1000 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        const projection = d3.geoMercator()
            .fitExtent([[0, 0], [width, height]], geographicData);

        const path = d3.geoPath().projection(projection);
        const monSvg = d3.select("#map")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        const carte = monSvg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background-color", "white")
            .style("border", "1px solid black")
            .style("padding", "5px");

        const maxVictims = Math.max(...dataArray.map(state => state.nbvictims));

        const colorScale = d3.scaleLinear()
            .domain([0, maxVictims])
            .range(["#FFC4C4", "#ca1414"]);

        carte.selectAll("path")
            .data(geographicData.features)
            .join(enter => enter.append('path')
                .attr("d", path)
                .attr("id", d => d.properties.NAME)
                .attr("fill", d => {
                    const stateInfo = dataArray.find(state => state.state === d.properties.NAME);
                    return stateInfo ? colorScale(stateInfo.nbvictims) : "#272727";
                })
                .attr("stroke", "white")
                .attr("stroke-width", 1)
                .on("mouseover", function (event, d) {
                    const stateInfo = dataArray.find(state => state.state === d.properties.NAME);
                    if (stateInfo && stateInfo.nbvictims > 0) {
                        let victimsList;
                        if (stateInfo.victims.some(victim => victim.nom === "Victime inconnue")) {
                            const knownVictims = stateInfo.victims.filter(victim => victim.nom !== "Victime inconnue");
                            const unknownVictimsCount = stateInfo.victims.length - knownVictims.length;
                            const unknownVictimsLabel = unknownVictimsCount === 1 ? "victime inconnue" : "victimes inconnues";
                            victimsList = knownVictims.map(victim => victim.nom).join(", ");
                            if (unknownVictimsCount > 0) {
                                victimsList += `, ${unknownVictimsCount} ${unknownVictimsLabel}`;
                            }
                        } else {
                            victimsList = stateInfo.victims.map(victim => victim.nom).join(", ");
                        }
                        const nbVictims = stateInfo.nbvictims;
                        d3.select(this).attr("stroke-width", 3);
                        tooltip.style("visibility", "visible")
                            .html(`<strong>${d.properties.NAME}</strong><br/>Nombre de victimes: ${nbVictims}<br/>Liste des victimes: ${victimsList}`);
                    }
                })
                .on("mousemove", function (event) {
                    tooltip.style("top", (event.pageY - 10) + "px")
                        .style("left", (event.pageX + 10) + "px");
                })
                .on("mouseout", function () {
                    d3.select(this).attr("stroke-width", 1);
                    tooltip.style("visibility", "hidden");
                }));

        const numBlocks = 10;
        const legendData = d3.range(numBlocks).map(i => i / (numBlocks - 1) * maxVictims);

        document.querySelector('#colorScale').innerHTML ="";

        const colorContainer = d3.select('#colorScale')
            .style("display", "flex")
            .style("flex-direction", "row")
            .style("align-items", "center");

        const colorBlocksContainer = colorContainer.append('div')
            .style("display", "flex")
            .style("flex-direction", "row")
            .style("align-items", "center");

            colorContainer.append('div')
            .style('margin-right', '5px')
            .style('font-size', '14px')
            .style('color', 'white')
            .style("align-items", "left")
            .text('Nombre de victimes par état par ordre croissant')


        colorBlocksContainer.selectAll('.colorBlock')
            .data(legendData)
            .enter()
            .append('div')
            .attr('class', 'colorBlock')
            .style('width', '20px')
            .style('height', '20px')
            .style('background-color', d => colorScale(d))
            .style('margin', '2px');
    };

export { displayKillers, displayKiller, displayDiagramme, displayCarte }