var os = require('os');
const WebSocket = require('ws');
const moment = require('moment');

const config = {
    hostname: os.hostname,
    ip: "127.0.0.1",
    port: 8080
}

const wss = new WebSocket.Server({
    port: config.port,
    clientTracking: true
});

wss.logMessage = ({ id, message, error = false, success = false }) => {
    let date = moment().format('DD.MM.YYYY HH:mm:ss');
    if (error) {
        console.log(`${date} - ${id}: \x1b[31m${message}\x1b[0m`);
        return;
    } else if (success) {
        console.log(`${date} - ${id}: \x1b[32m${message}\x1b[0m`);
        return;
    }
    console.log(`${date} - ${id}: ${message}`);
}

require('dns').lookup(os.hostname(), (err, add, fam) => {
    config.ip = +add;
});

const game = {
    id: Math.round(Math.random() * 8999 + 1000)
}

wss.logMessage({ message: `server running on ${config.hostname}:${config.port}`, id: 'SERVER', success: true });
wss.logMessage({ message: `started game lobby (${game.id})`, id: 'SERVER', success: true });

wss.getUniqueID = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4();
};

wss.getAllSensors = () => {
    let sensors = [];
    wss.clients.forEach((ws) => {
        if (ws.type === 'SENSOR') {
            sensors.push(ws);
        }
    });
    return sensors;
}

wss.getAllDisplays = () => {
    let displays = [];
    wss.clients.forEach((ws) => {
        if (ws.type === 'DISPLAY') {
            displays.push(ws);
        }
    });
    return displays;
}

wss.getById = ({ id }) => {
    let client;
    wss.clients.forEach((ws) => {
        if (ws.id === id) {
            client = ws;
        }
    });
    return client;
}

wss.kallib = ({ ws, wss, active }) => {
    wss.logMessage({ id: ws.id, message: `${active ? "start" : "end"} callib` });
    ws.send(JSON.stringify({ event: 'S_SEND_DATA', data: { send: active, filter: true } }));
    ws.send(JSON.stringify({ event: 'S_CALLIB', data: { active: active } }));
    ws.kallib = active;
    if (!active && ws.kallibValues.xmax > 0) {
        let { xmax, ymax, zmax, xmin, ymin, zmin } = ws.kallibValues;
        wss.logMessage({ message: `kallib done successfully`, id: ws.id, success: true });
        wss.logMessage({ message: `x = ${xmin} / ${xmax}`, id: ws.id, });
        wss.logMessage({ message: `y = ${ymin} / ${ymax}`, id: ws.id, });
        wss.logMessage({ message: `z = ${zmin} / ${zmax}`, id: ws.id, });
    }
}

wss.getRelativeValue = (x, y, z, ws) => {
    let { xmax, ymax, zmax, xmin, ymin, zmin } = ws.kallibValues;
    let bx = x < 0 ? -xmin : xmax;
    x = x / bx * 100 + 100;

    let by = y < 0 ? -ymin : ymax;
    y = y / by * 100 + 100;

    let bz = z < 0 ? -zmin : zmax;
    z = z / bz * 100 + 100;

    return { x, y, z };
}

wss.on('connection', (ws, req) => {
    ws.id = wss.getUniqueID();
    // check if connection is broken

    ws.kallibValues = {
        xmax: 0,
        ymax: 0,
        zmax: 0,
        xmin: 0,
        ymin: 0,
        zmin: 0
    }

    ws.on('message', (message) => {
        let json;
        try {
            json = JSON.parse(message);
        } catch (err) {
            wss.logMessage({ id: ws.id, message: `bad json: ${message}`, error: true });
            return;
        }

        switch (json.event.toUpperCase()) {
            case 'C_LOGIN':
                ws.type = json.data.type.toUpperCase();
                ws.gameId = json.data.gameId;
                wss.logMessage({ id: ws.id, message: `client login as ${ws.type}` })

                if (ws.type === 'DISPLAY') {
                    ws.send(JSON.stringify({
                        event: 'S_INIT_DISPLAY',
                        data: {
                            host: config.hostname,
                            port: config.port,
                            gameId: ws.gameId
                        }
                    }));
                } else if (ws.type === 'SENSOR') {
                    // Kalib
                    wss.kallib({ ws: ws, wss: wss, active: true });
                    setTimeout(() => {
                        wss.kallib({ ws: ws, wss: wss, active: false });
                    }, 10000);
                } else {
                    wss.logMessage({ id: ws.id, message: `bad type (${ws.type})`, error: true });
                }

                if (wss.getAllDisplays().length > 0) {
                    wss.logMessage({ id: ws.id, message: `DISPLAY_NUM=\x1b[32m${wss.getAllDisplays().length}\x1b[0m` });
                } else {
                    wss.logMessage({ id: ws.id, message: `DISPLAY_NUM=\x1b[31m${wss.getAllDisplays().length}\x1b[0m` });
                }

                if (wss.getAllSensors().length > 0) {
                    wss.logMessage({ id: ws.id, message: `SENSOR_NUM=\x1b[32m${wss.getAllSensors().length}\x1b[0m` });
                } else {
                    wss.logMessage({ id: ws.id, message: `SENSOR_NUM=\x1b[31m${wss.getAllSensors().length}\x1b[0m` });
                }

                break;

            case 'C_GET_GAMEID':
                // return game id
                ws.send(JSON.stringify({ event: 'S_SET_GAMEID', data: { gameId: ws.gameId ? ws.gameId : game.id } }));
                break;

            case 'C_SENSOR_DATA':
                // get data
                let { data } = json;
                let displays = wss.getAllDisplays();
                if (displays.length > 0) {
                    let { x, y, z } = data;
                    let relativeValues = wss.getRelativeValue(x, y, z, ws);
                    displays.forEach((display) => {
                        display.send(JSON.stringify({
                            event: 'S_SENSOR_DATA',
                            data: {
                                rx: relativeValues.x,
                                ry: relativeValues.y,
                                rz: relativeValues.z,
                                x: x,
                                y: y,
                                z: z
                            }
                        }));
                    })
                    wss.logMessage({ id: ws.id, message: `x=${x}, y=${y}, z=${z}` });
                    wss.logMessage({ id: ws.id, message: `\x1b[36mx=${relativeValues.x}, y=${relativeValues.y}, z=${relativeValues.z}\x1b[0m` });
                } else {
                    // no connected displays stop sending data
                    ws.send(JSON.stringify({ event: 'S_ERR_NO_DISPLAYS' }));
                    //ws.send(JSON.stringify({ event: 'S_SEND_DATA', data: { send: false, filter: true } }));
                }

                if (ws.kallib) {
                    let { x, y, z } = data;
                    let { xmax, ymax, zmax, xmin, ymin, zmin } = ws.kallibValues;
                    xmax = x > xmax ? x : xmax;
                    ymax = y > ymax ? y : ymax;
                    zmax = z > zmax ? z : zmax;

                    xmin = x < xmin ? x : xmin;
                    ymin = y < ymin ? y : ymin;
                    zmin = z < zmin ? z : zmin;

                    ws.kallibValues = { xmax, ymax, zmax, xmin, ymin, zmin };
                }
                break;

            default:
                break;
        }
    });

    ws.send(JSON.stringify({ event: 'S_REQUEST_TYPE' }));

    let ip = req.connection.remoteAddress.slice("::ffff:".length);
    wss.logMessage({ id: ws.id, message: `new client connected \x1b[35m${ip}\x1b[0m` });
});