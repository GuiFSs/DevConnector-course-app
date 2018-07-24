import isEmpty from '../validation/is-empty';
import types from '../actions/types';

const initialState = {
    isAuthenticated: false,
    user: {}
}

export default (state = initialState, action) => {
    switch (action.type) {
        case types.SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            }
        default: 
            return state;
    }
};