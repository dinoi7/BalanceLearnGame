import { SET_CONNECTION_STATE,
    SET_WEBSOCKET_REF, 
    SET_POSITION}  from './types.js'


export const setConnectionState = (payload) => {
    //console.log('setConnectionState', payload)
    return {
        type: SET_CONNECTION_STATE,
        payload
    };
};


export const setWebSocketRef = (payload) => {
    //console.log('setWebSocketRef', payload)
    return {
        type: SET_WEBSOCKET_REF,
        payload
    };
};


export const setPosition = (payload) => {
    console.log('setPosition_action', payload)
    return {
        type: SET_POSITION,
        payload
    };
};

export const sendMessage = (message) => async (dispatch, getState) => {
    console.log('sendMessage', message)

    const { refWebSocket, connected } = getState();
    //console.log('sending trefWebSocket= ', refWebSocket);
    //console.log('sending connected= ', connected);
    if(connected) {
        console.log('sending the message= ', message);
          refWebSocket.sendMessage(message);
      }
};

