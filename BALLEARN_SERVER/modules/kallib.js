const print = require(__dirname + '/print.js');
const start = (ws) => {
    if (ws.kallib) {
        print.error(ws.id, `kallib already started`);
        return false;
    }

    print.info(ws.id, `starting kallib...`);

    // send start to the sensor client
    ws.send(JSON.stringify({ event: 'S_SEND_DATA', data: { send: active, filter: true } }));
    print.debug(ws.id, `send S_SEND_DATA with send: ${active}`);
    ws.send(JSON.stringify({ event: 'S_CALLIB', data: { active: active } }));
    print.debug(ws.id, `send S_CALLIB with active: ${active}`);

    ws.kallib = true;
}

const stop = (ws) => {
    if (!ws.kallib) {
        print.error(ws.id, `no kallib running, unable to stop kallib`);
        return false;
    }

    if (ws.kallibValues.xmax >= 10) {
        print.error(ws.id, `kallib ended with error`);
        return false;
    }

    ws.kallib = false;
    let { xmax, ymax, zmax, xmin, ymin, zmin } = ws.kallibValues;
    print.success(ws.id, `kallib done successfully`);
    print.success(ws.id, `x = ${xmin} / ${xmax}`)
    print.success(ws.id, `y = ${ymin} / ${ymax}`)
    print.success(ws.id, `z = ${zmin} / ${zmax}`)
    return true;
}

module.exports = { start, stop };