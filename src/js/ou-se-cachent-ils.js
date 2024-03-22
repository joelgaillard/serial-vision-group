document.addEventListener('DOMContentLoaded', function () {
    fetch('/data/ou-se-cachent-ils.json')
        .then(response => response.json())
        .then(data => {
            const grid = document.getElementById('grid');
            data.forEach((stateData, index) => {
                let hexCell = document.createElement('div');
                hexCell.className = 'hex';
                hexCell.innerHTML = `
                <div class="hex-title">${stateData.state}</div>
                <div class="hex-details">
                    <div>Victimes totales: ${stateData.SerialKillersTotalVictims1992 - 2019}</div>
                    <div>Tueur le plus connu: ${stateData.SerialKillersMostKnownKiller}</div>
                    <div>Nombre de victimes: ${stateData.SerialKillersMkNumVictims}</div>
                    <div>Statut final: ${stateData.SerialKillersMkFinalStatus}</div>
                </div>
            `;
                grid.appendChild(hexCell);
            });
        })
        .catch(error => console.error('Une erreur est survenue lors du chargement des données:', error));
});