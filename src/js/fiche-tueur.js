import { loadJson, displayPhotosKillers } from "../helpers";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const nomTueur = urlParams.get('nom');

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

const afficheInfos = () => {
    
}

const routeur = async () => {
    const tueur = await displayKiller("./data/serial-killer-joel.json", nomTueur)
    console.warn(tueur)
    afficheInfos(tueur)
}

routeur()