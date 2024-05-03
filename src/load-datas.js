const loadJson = (url) => fetch(url).then((response) => response.json());

const loadKillers = () => loadJson("./data/serial-killer-joel.json");

const loadKillerById = (id) => {
    return loadKillers().then((killers) => {
        const killer = killers.find((killer) => killer.id === parseInt(id));
        if (!killer) {
            throw new Error(`Aucun tueur en série trouvé avec l'ID ${id}`);
        }
        return killer;
    });
};

const loadMap = () => loadJson("./data/carte-usa.json");

const loadHexagonMap = () => loadJson("./data/carte-hexagon.json");

const loadSerialKillersData = () => loadJson("./data/ou-se-cachent-ils.json");


export { loadKillers, loadKillerById, loadJson, loadMap, loadHexagonMap, loadSerialKillersData };