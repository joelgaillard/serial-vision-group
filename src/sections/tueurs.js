import { loadKillers, loadKillerById } from "../load-datas";

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









export {displayKillers, displayKiller}