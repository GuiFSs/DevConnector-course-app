import types from '../actions/types';

const initialState = {};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.GET_ERRORS: return action.payload;
        case types.CLEAR_ERRORS: return {};
        default: return state;
    }
};