const WebSocket = require('ws');

const ws = new WebSocket('ws://127.0.0.1:8080');

let test = {
  type: "DISPLAY",
  host: false,
  port: false,
  gameId: false
}

ws.on('message', (message) => {
  let json;
  try {
    json = JSON.parse(message);
  } catch (err) {
    console.error(`bad json: ${message}`);
    return;
  }
  console.log(json.event);

  switch (json.event.toUpperCase()) {
    case 'S_REQUEST_TYPE':
      ws.send(JSON.stringify({ event: "C_LOGIN", data: { type: test.type, gameId: 1239123 } }));
      break;
    case 'S_INIT_DISPLAY':
      let { data } = json;
      test.host = data.host;
      test.port = data.port;
      console.log(JSON.stringify(test));
      break;
  
    default:
      break;
  }
});