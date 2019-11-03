import { SET_CONNECTION_STATE,
    SET_WEBSOCKET_REF}  from './types.js'


export const setConnectionState = (payload) => {
    return {
        type: SET_CONNECTION_STATE,
        payload
    };
};


export const setWebSocketRef = (payload) => {
    return {
        type: SET_WEBSOCKET_REF,
        payload
    };
};


export const sendMessage = (message) => async (dispatch, getState) => {
    const { refWebSocket, connected } = getState();
    if(connected) {
        console.log('sending the message= ', message);
          refWebSocket.sendMessage(message);
      }
};

