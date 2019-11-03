import { SET_NAVIGATION_HEIGHT}  from './types.js'


export const setNavigationHeight = (payload) => {
    //console.log('setNavigationHeight', payload)
    return {
        type: SET_NAVIGATION_HEIGHT,
        payload
    };
};


