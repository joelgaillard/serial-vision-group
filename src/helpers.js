function loadSectionCSS() {
    function loadCSS(filename){
        const file = document.createElement("link");
        file.setAttribute("rel", "stylesheet");
        file.setAttribute("type", "text/css");
        file.setAttribute("href", filename);
        document.head.appendChild(file);
    }


    document.querySelectorAll('section').forEach(section => {
        const sectionId = section.id;
        const cssFile = `./src/css/${sectionId}.css`;
        const existingLink = document.querySelector(`link[href="${cssFile}"]`);
        if (existingLink) {
            existingLink.remove();
        }
    });

    const activeSection = document.querySelector('section.active');
    if (activeSection) {
        const sectionId = activeSection.id;
        const cssFile = `./src/css/${sectionId}.css`;
        loadCSS(cssFile);
    }
}


const displaySection = (id) => {
    // On essaie de trouver la section active et on enlève la classe "active"
    // Hint: Comment gérer le cas où on ne trouve rien ?
    const activeSection = document.querySelector('section.active')
    if(activeSection)
      activeSection.classList.remove('active')
  
    // ou sur une ligne:
    // document.querySelector('section.active')?.classList.remove('active')
  
    // On essaie de trouver la section qui correspond à l'id passé
    const newSection = document.querySelector(`#${id}-section`)
    if(newSection)
      newSection.classList.add('active')
      loadSectionCSS();
  
    // ou sur une ligne:
    // document.querySelector(`#${id}-section`)?.classList.add('active')
  }




export {displaySection, loadSectionCSS}