import { loadJson } from "./helpers";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const nomTueur = urlParams.get('nom');
const titre = document.querySelector("h1");




const displayKiller = async (url, nom) => {
    try {
        const tueurs = await loadJson(url);
        let tueurTrouve = null;
        tueurs.forEach(tueur => {
            if (tueur.nom.toLowerCase() === nom) {
                tueurTrouve = tueur;

            }
        });
        return tueurTrouve;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const afficheInfos = (tueur) => {
    console.warn(tueur)
    const titre = document.querySelector("h1");
    const photo = document.querySelector(".photo");
    const blocTexte = document.querySelector(".text-lines");

    titre.innerHTML = `${tueur.nom} ${tueur.prenom}`;
    photo.src = `/assets/img/${tueur.prenom.toLowerCase()}-${tueur.nom.toLowerCase()}.jpg`

  // Sélection du conteneur SVG
  const svgContainer = d3.select('.diagram');

  // Calculer la largeur et la hauteur disponibles dans le conteneur SVG
  const containerWidth = svgContainer.node().getBoundingClientRect().width;
  const containerHeight = svgContainer.node().getBoundingClientRect().height;

  // Définir les marges du diagramme
  const margin = { top: 20, right: 20, bottom: 50, left: 50 };

  // Calculer la largeur et la hauteur réelle du diagramme en tenant compte des marges
  const width = containerWidth - margin.left - margin.right;
  const height = containerHeight - margin.top - margin.bottom;

  // Redimensionner le conteneur SVG en fonction de ces dimensions
  const svg = svgContainer
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Calculer les données pour le diagramme
  const victimesParAnnee = tueur.victimes.reduce((acc, victime) => {
      const annee = new Date(victime.date).getFullYear();
      acc[annee] = (acc[annee] || 0) + 1;
      return acc;
  }, {});

  // Création de l'échelle pour l'axe x
  const x = d3.scaleBand()
      .domain(Object.keys(victimesParAnnee))
      .range([0, width])
      .padding(0.1);

  // Création de l'échelle pour l'axe y
  const y = d3.scaleLinear()
      .domain([0, d3.max(Object.values(victimesParAnnee))])
      .range([height, 0]);

  // Création de l'axe x
  const xAxis = d3.axisBottom(x);

  // Création de l'axe y
  const yAxis = d3.axisLeft(y);

  // Ajout des barres
  svg.selectAll("rect")
      .data(Object.entries(victimesParAnnee))
      .enter()
      .append("rect")
      .attr("x", d => x(d[0]))
      .attr("y", d => y(d[1]))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d[1]))
      .attr("fill", "steelblue");

  // Ajout de l'axe x
  svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

  // Ajout de l'axe y
  svg.append("g")
      .call(yAxis);

  // Ajout du titre de l'axe x
  svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.top + 20)
      .attr("text-anchor", "middle")
      .text("Années");

  // Ajout du titre de l'axe y
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Nombre de victimes");
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

const routeur = async () => {
    const tueur = await displayKiller("/data/serial-killer-joel.json", nomTueur)
    afficheInfos(tueur)
}

routeur()