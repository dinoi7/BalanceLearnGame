import { combineReducers } from 'redux'

import { SET_CONNECTION_STATE,
    SET_WEBSOCKET_REF,
    SET_POSITION,
    SET_NAVIGATION_HEIGHT
     } from '../actions/types'



const INITIAL_STATE_CONNECTED =    false;

const connectionReducer = (state=INITIAL_STATE_CONNECTED, action) => {    
    switch(action.type) {
        case SET_CONNECTION_STATE:            
            return action.payload;
        default:
            return state;
    }
};


const INITIAL_STATE_WEBSOCKET_REF =  null;

const websocketRefReducer = (state=INITIAL_STATE_WEBSOCKET_REF, action) => {    
    switch(action.type) {
    case SET_WEBSOCKET_REF:
        return action.payload;
    default:
        return state;
    }
};

const INITIAL_STATE_POSITION =  {};

const positionReducer = (state=INITIAL_STATE_POSITION, action) => {    
    switch(action.type) {
    case SET_POSITION:
        return action.payload;
    default:
        return state;
    }
};

const navigationHeightReducer = (state=0, action) => {    
    switch(action.type) {
    case SET_NAVIGATION_HEIGHT:
        return action.payload;
    default:
        return state;
    }
};



export default combineReducers( {
    connected: connectionReducer,   
    refWebSocket: websocketRefReducer,
    position: positionReducer,
    navigationHeight: navigationHeightReducer
})