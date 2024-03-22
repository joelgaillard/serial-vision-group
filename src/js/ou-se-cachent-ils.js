document.addEventListener('DOMContentLoaded', function () {
    fetch('/data/ou-se-cachent-ils.json')
        .then(response => response.json())
        .then(data => {
            const grid = document.getElementById('grid');
            data.forEach((stateData) => {
                let hexCell = document.createElement('div');
                hexCell.className = 'hex';
                hexCell.innerHTML = `
                    <div class="hex-content">
                        <span class="state-abbr">${stateData.state.slice(0, 2).toUpperCase()}</span>
                        <span class="details">Victimes: ${stateData.SerialKillersTotalVictims1992 - 2019}</span>
                    </div>
                `;
                grid.appendChild(hexCell);
            });
        })
        .catch(error => console.error('Une erreur est survenue lors du chargement des données:', error));
});
