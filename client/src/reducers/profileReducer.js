import types from '../actions/types';

const initialState = {
    profile: null,
    profiles: null,
    loading: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.PROFILE_LOADING:
            return {
                ...state,
                loading: true
            };
        case types.GET_PROFILE:
            return {
                ...state,
                profile: action.payload,
                loading: false
            };
        case types.CLEAR_CURRENT_PROFILE:
            return {
                ...state,
                profile: null
            };
        default:
            return state;
    }
}