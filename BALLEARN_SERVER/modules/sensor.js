const getRelativeValue = (x, y, z, ws) => {
    let { xmax, ymax, zmax, xmin, ymin, zmin } = ws.kallibValues;
    let bx = x < 0 ? -xmin : xmax;
    x = x / bx * 100 + 100;

    let by = y < 0 ? -ymin : ymax;
    y = y / by * 100 + 100;

    let bz = z < 0 ? -zmin : zmax;
    z = z / bz * 100 + 100;

    return { x, y, z };
}
const handleDataFlow = (ws, displays, data) => {
    if (displays.length > 0) {
        let { x, y, z } = data;
        let relativeValues = sensor.getRelativeValue(x, y, z, ws);
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
        print.debug(ws.id, `x=${x}, y=${y}, z=${z}`);
        print.debug(ws.id, `\x1b[36mx=${relativeValues.x}, y=${relativeValues.y}, z=${relativeValues.z}\x1b[0m`);
    } else {
        // no connected displays stop sending data
        ws.send(JSON.stringify({ event: 'S_ERR_NO_DISPLAYS' }));
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
}
module.exports = { getRelativeValue, handleDataFlow };