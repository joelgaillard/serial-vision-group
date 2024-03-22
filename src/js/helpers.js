// Tout
const loadJson = (url) => fetch(url).then((response) => response.json())

// Page les-plus-connus.js
const displayPhotosKillers = (url) => {
    const photoContainer = document.querySelector(".photo-grid");
photoContainer.innerHTML = "";
    loadJson(url).then((tueurs) => {
        tueurs.forEach(tueur => {

            const html = `
            <div class="photo-item">
            <a href="fiche-tueur.html?nom=${encodeURIComponent(tueur.nom.toLowerCase())}" class="photo-link">
            <img src="/assets/img/${tueur.prenom.toLowerCase()}-${tueur.nom.toLowerCase()}.jpg" alt="${tueur.prenom} ${tueur.nom}" style="max-width: 100%;" width="100%">
      <div class="photo-title">${tueur.prenom} ${tueur.nom}</div>
    </a>
  </div>`;
            photoContainer.innerHTML += html;
        });
    })
}


export {loadJson, displayPhotosKillers}