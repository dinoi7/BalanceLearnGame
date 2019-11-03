var os = require('os');
const WebSocket = require('ws');

const config = require(__dirname + '/config.js');
const print = require(__dirname + '/modules/print.js');
const utils = require(__dirname + '/modules/utils.js');
const event = require(__dirname + '/modules/event.js');
const clients = require(__dirname + '/modules/clients.js');

// set hostname
config.hostname = os.hostname;

// start websocket server
const wss = new WebSocket.Server({
    port: config.port,
    clientTracking: true
});
print.server(`server running on ${config.hostname}:${config.port}`);

wss.on('connection', (ws, req) => {
    // init client
    clients.initClient(ws);

    const event = require(__dirname + '/event.js');
    ws.on('message', (message) => {
        event.handle(wss, config, ws, message);
    });

    ws.send(JSON.stringify({ event: 'S_REQUEST_TYPE' }));

    let ip = req.connection.remoteAddress.slice("::ffff:".length);
    print.info(ws.id, `new client connected ${ip}`);
});