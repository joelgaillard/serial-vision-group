"use strict"
const photoContainer = document.querySelector(".photo-grid");
photoContainer.innerHTML = "";

const loadJson = (url) => fetch(url).then((response) => response.json())

const displayKillers = () => {
    loadJson("./data/serial-killer-joel.json").then((tueurs) => {
        tueurs.forEach(tueur => {

            const html = `
            <div class="photo-item">
    <a href=".html" class="photo-link">
      <img src="./assets/img/${tueur.prenom.toLowerCase()}-${tueur.nom.toLowerCase()}.jpg" alt="${tueur.prenom} ${tueur.nom}" style="max-width: 100%;" width="100%">
      <div class="photo-title">${tueur.prenom} ${tueur.nom}</div>
    </a>
  </div>`;

            photoContainer.innerHTML += html;

        });

    })


}

displayKillers()


