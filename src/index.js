import { displaySection, loadSectionCSS } from "./helpers"

import { displayKillers, displayKiller } from "./sections/tueurs"

const routeur = () => {
    const hash = window.location.hash || '#accueil'
    const hashs = hash.split('-')
  
    // Colorie le lien (barre fond)
    // activateLink(hashs[0])
  
    switch(hashs[0]) {
      case '#accueil':
        displaySection('accueil')
        loadSectionCSS()

      break;

      case '#question':
        if(hashs[1]) {
          displaySection('question')
          displayQuestion(hashs[1])
        } 
      break;

      case '#resultat':
          displaySection('resultat')
          displayResultat()
      break;

      case '#tueurs':
        if(hashs[1]) {
          displaySection('tueur')
          displayKiller(hashs[1])
          loadSectionCSS()

        } else {
          displaySection('tueurs')
          displayKillers()
          loadSectionCSS()
        }
      break;
  
      case '#infos':
        displaySection('infos')
      break;

      case '#about':
        displaySection('about')
        loadSectionCSS()
      break;
    }
  }
  
  // On veut être averti des changements
  window.addEventListener('hashchange', routeur)
  
  // on exécute une première fois au chargement de la page pour afficher la bonne section
  routeur()