const config = require('../config.js');
const moment = require('moment');
const colors = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",
    fg: {
        Black: "\x1b[30m",
        Red: "\x1b[31m",
        Green: "\x1b[32m",
        Yellow: "\x1b[33m",
        Blue: "\x1b[34m",
        Magenta: "\x1b[35m",
        Cyan: "\x1b[36m",
        White: "\x1b[37m",
        Crimson: "\x1b[38m"
    },
    bg: {
        Black: "\x1b[40m",
        Red: "\x1b[41m",
        Green: "\x1b[42m",
        Yellow: "\x1b[43m",
        Blue: "\x1b[44m",
        Magenta: "\x1b[45m",
        Cyan: "\x1b[46m",
        White: "\x1b[47m",
        Crimson: "\x1b[48m"
    }
};

const debug = (id, message) => {
    if (config.debug) {
        let d = moment().format("dd.mm.YYYY HH:mm:ss");
        console.log(`${colors.Reset}${d} - ${id}: ${colors.fg.Cyan}DEBUG${colors.Reset} ${message}`);
    }
}

const info = (id, message) => {
    let d = moment().format("dd.mm.YYYY HH:mm:ss");
    console.log(`${colors.Reset}${d} - ${id}: ${message}`);
}

const warning = (id, message) => {
    let d = moment().format("dd.mm.YYYY HH:mm:ss");
    console.log(`{d} - ${id}: ${colors.fg.Yellow}$${message}${colors.Reset}`);
}

const error = (id, message) => {
    let d = moment().format("dd.mm.YYYY HH:mm:ss");
    console.log(`${d} - ${id}: ${colors.fg.Red}${message}${colors.Reset}`);
}

const success = (id, message) => {
    let d = moment().format("dd.mm.YYYY HH:mm:ss");
    console.log(`${d} - ${id}: ${colors.fg.Green}${message}${colors.Reset}`);
}

const server = (message) => {
    let d = moment().format("dd.mm.YYYY HH:mm:ss");
    console.log(`${d} - SERVER: ${colors.fg.Magenta}${message}${colors.Reset}`);
}

module.exports = { debug, info, warning, error, success, server };