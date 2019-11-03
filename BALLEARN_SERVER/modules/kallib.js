const print = require(__dirname + '/print.js');
const config = require('../config.js');
const start = (ws) => {
    if (ws.kallib) {
        print.error(ws.id, `kallib already started`);
        return false;
    }

    print.info(ws.id, `starting kallib... (${config.callib.time / 1000}s)`);

    // send start to the sensor client
    ws.send(JSON.stringify({ event: 'S_SEND_DATA', data: { send: true, filter: true } }));
    print.debug(ws.id, `send S_SEND_DATA with send: true`);
    ws.send(JSON.stringify({ event: 'S_CALLIB', data: { active: true } }));
    print.debug(ws.id, `send S_CALLIB with active: true`);

    ws.kallib = true;
}

const stop = (ws) => {
    if (!ws.kallib) {
        print.error(ws.id, `no kallib running, unable to stop kallib`);
        return false;
    }

    if (ws.kallibValues.xmax <= 10) {
        print.warning(ws.id, `kallib ended with warning (xmax=${ws.kallibValues.xmax})`);
        ws.send(JSON.stringify({ event: 'S_ERR_CALLIB' }));
        return false;
    }

    ws.kallib = false;
    let { xmax, ymax, zmax, xmin, ymin, zmin } = ws.kallibValues;
    print.success(ws.id, `kallib successfull`);
    print.success(ws.id, `x = ${xmin} / ${xmax}`)
    print.success(ws.id, `y = ${ymin} / ${ymax}`)
    print.success(ws.id, `z = ${zmin} / ${zmax}`)

    ws.send(JSON.stringify({ event: 'S_CALLIB', data: { active: false } }));
    print.debug(ws.id, `send S_CALLIB with active: false`);
    return true;
}

module.exports = { start, stop };