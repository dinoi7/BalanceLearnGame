const getAllSensors = (wss) => {
    let sensors = [];
    wss.clients.forEach((ws) => {
        if (ws.type === 'SENSOR') {
            sensors.push(ws);
        }
    });
    return sensors;
}

const getAllDisplays = (wss) => {
    let displays = [];
    wss.clients.forEach((ws) => {
        if (ws.type === 'DISPLAY') {
            displays.push(ws);
        }
    });
    return displays;
}

const getById = (wss, id) => {
    let client;
    wss.clients.forEach((ws) => {
        if (ws.id === id) {
            client = ws;
        }
    });
    return client;
}

const initClient = (ws) => {
    ws.id = utils.getUniqueID();

    ws.kallibValues = {
        xmax: 0,
        ymax: 0,
        zmax: 0,
        xmin: 0,
        ymin: 0,
        zmin: 0
    }
}

module.exports = { getById, getAllSensors, getAllDisplays, initClient }