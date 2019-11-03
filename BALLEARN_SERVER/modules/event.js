const config = require('../config.js');
const print = require(__dirname + '/print.js');
const kallib = require(__dirname + '/kallib.js');
const sensor = require(__dirname + '/sensor.js');
const clients = require(__dirname + '/clients.js');
const game = {id: "Test129837"};

const handle = (wss, config, ws, message) => {

    let json;
    try {
        json = JSON.parse(message);
    } catch (err) {
        print.error(ws.id, `recived bad json ${message}`);
        return false;
    }

    print.debug(ws.id, `client sent ${json.event}`);

    switch (json.event.toUpperCase()) {
        case 'C_LOGIN':
            ws.type = json.data.type.toUpperCase();
            ws.gameId = json.data.gameId;
            print.success(ws.id, `client login as ${ws.type}`);

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
                if (config.callib.autostart) {
                    kallib.start(ws);
                    setTimeout(() => {
                        kallib.stop(ws);
                    }, config.callib.time);
                }  
            } else {
                print.error(ws.id, `bad login type (${ws.type})`);
            }

            let displaysNum = clients.getAllDisplays(wss).length;
            let sensorNum = clients.getAllSensors(wss).length;
            print.info("INFO", `DISPLAY_NUM=${displaysNum}`);
            print.info("INFO", `SENSOR_NUM=${sensorNum}`);

            break;

        case 'C_GET_GAMEID':
            // return game id
            print.debug(ws.id, `send S_SET_GAMEID`);
            ws.send(JSON.stringify({ event: 'S_SET_GAMEID', data: { gameId: ws.gameId ? ws.gameId : game.id } }));
            break;

        case 'C_SENSOR_DATA':
            // get data
            let { data } = json;
            let displays = clients.getAllDisplays(wss);
            sensor.handleDataFlow(ws, displays, data)
            break;

        default:
            break;
    }
}
module.exports = { handle };