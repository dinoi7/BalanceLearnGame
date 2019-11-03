import {  
    S_REQUEST_TYPE,
    C_GET_GAMEID,
    C_LOGIN,
    C_DISPLAY, 
    S_SET_GAMEID,
    S_SENSOR_DATA } from './const';


export function createGameIdRequest() {
   const message = { event: C_GET_GAMEID};
   return JSON.stringify(message);
}

export function isRequestTypeMessage(message) {

    const requestTypeMessage = ( message && message.event && message.event===S_REQUEST_TYPE);
    return requestTypeMessage;   
 }

 /*
 export function createTypeAnswer() {
    const message = { event: C_DISPLAY};
    return JSON.stringify(message);
 }
 */

 export function retrieveGameID(message) {   
    // console.log('retrieveGameID', message.data)
    const gameId = message.data.gameId;
    return gameId;
}

export function isRetrieveGameIDMessage(message) {   
    const gameIdMessage = message && message.event && message.event === S_SET_GAMEID;
    return gameIdMessage;
}

export function createLoginMessage(gameId) {
    const message = {
        event: C_LOGIN,
        data: {
            type: C_DISPLAY, 
            gameId: gameId
        }
    }
    return JSON.stringify(message);
}

export function isSensorDataMessage(message) {   
    const sensorDataMessage = message && message.event && message.event === S_SENSOR_DATA;
    return sensorDataMessage;
}

/*export function parseSensorDataMessage(data) {   
    
    let result = JSON.parse(data.data);
    console.log('data=', data); 
    console.log('result=', result); 
    return result;
}
*/