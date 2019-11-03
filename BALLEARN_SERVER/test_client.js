const WebSocket = require('ws');

const ws = new WebSocket('ws://127.0.0.1:8080');

let test = {
  type: "SENSOR",
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

  if (json.data) {
    console.log(`event: ${json.event} => ${JSON.stringify(json.data)}`);
  } else {
    console.log(`event: ${json.event}`);
  }


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
    case 'S_CALLIB':
      if (json.data.active) {
        let x = -8000;
        let y = -8000;
        let z = 0;
        const i = setInterval(() => {
          ws.send(JSON.stringify({ event: 'C_SENSOR_DATA', data: { x: x, y: y, z: z } }));
          x = x + 2000;
          y = y + 2000;
          z = 0;
        }, 500);
        setTimeout(() => {
          clearInterval(i);
          console.log("send fake data");
          setInterval(() => {
            ws.send(JSON.stringify({ event: 'C_SENSOR_DATA', data: { x: x, y: y, z: z } }));
            x = Math.random() * 0;
            y = Math.random() * 1000 + 4000;
          }, 1500);
        }, 5000);
      }
      break;

    default:
      break;
  }
});