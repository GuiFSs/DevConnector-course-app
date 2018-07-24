import types from '../actions/types';

const initialState = {
    isAuthenticated: false,
    user: {}
}

export default (state = initialState, action) => {
    switch (action.type) {
        case types.GET_ERRORS: return action.payload;
        default: 
            return state;
    }
};